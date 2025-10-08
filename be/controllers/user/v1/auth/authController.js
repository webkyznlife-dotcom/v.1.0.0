import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MstUser } from "../../../../models/mst_users/mst_users.js";
import { MstRole } from "../../../../models/mst_roles/mst_roles.js";
import { MstRoleMenu } from "../../../../models/mst_role_menu/mst_role_menu.js";
import { MstMenu } from "../../../../models/mst_menu/mst_menu.js";
import { MstMenuLabel } from "../../../../models/mst_menu_label/mst_menu_label.js";

// Helper: susun menu menjadi hierarchy berdasarkan parent_id
const buildMenuHierarchy = (rawMenus) => {
  const menuMap = {};
  const rootMenus = [];

  // Buat map awal semua menu yang aktif saja
  rawMenus
    .filter(m => m.is_active) // hanya menu aktif
    .forEach(m => {
      menuMap[m.menu_id] = {
        menu_id: m.menu_id,
        menu_name: m.menu_name,
        menu_slug: m.menu_slug,
        menu_url: m.menu_url,
        menu_icon: m.menu_icon,
        parent_id: m.parent_id,
        label: m.label?.mml_name || "Unlabeled",
        sub_menus: []
      };
    });

  // Susun hierarchy menu
  Object.values(menuMap).forEach(menu => {
    if (menu.parent_id && menuMap[menu.parent_id]) {
      menuMap[menu.parent_id].sub_menus.push(menu);
    } else {
      rootMenus.push(menu);
    }
  });

  return rootMenus;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user + role + menu
    const user = await MstUser.findOne({
      where: { email },
      include: [
        {
          model: MstRole,
          include: [
            {
              model: MstRoleMenu,
              include: [
                {
                  model: MstMenu,
                  include: [
                    { model: MstMenuLabel, as: "label" },
                    { model: MstMenu, as: "sub_menus" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1d" }
    );

    // Update last_login
    user.last_login = new Date();
    await user.save();

    // Ambil raw menus dari role
    const rawMenus = user.MstRole?.MstRoleMenus?.map(rm => rm.MstMenu) || [];

    // Susun menu menjadi hierarchy dengan label
    const menus = buildMenuHierarchy(rawMenus);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.MstRole?.role_name || null,
        menus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
