import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PartnerCard from './PartnerCard';

interface Partner {
  mc_id: number;
  mc_name: string;
  mc_description: string;
  mc_image: string;
  mc_status: boolean;
}

const Collaboration: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/v1/collaboration`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartners(response.data.data);
      } catch (err) {
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section style={styles.section}>
      {/* Judul */}
      <div
        className="flex items-center mb-2 pl-4 pr-4"
        style={{ alignSelf: 'flex-start', textAlign: 'left' }}
      >
        <h2 className="text-lg sm:text-sm font-bold text-gray-800 flex items-center gap-2 leading-none">
          Collaboration With
          <span className="w-5 h-[2px] bg-red-500 inline-block" />
        </h2>
      </div>

      {/* Deskripsi */}
      <p style={styles.description} className="text-gray-600">
        We are proud to collaborate with remarkable partners who share our vision in creating
        meaningful impact through innovation, dedication, and lasting partnerships.
      </p>

      {/* Logos horizontal scroll */}
      <div
        style={{ ...styles.logosContainer, overflowX: 'auto' }}
        className="hide-scrollbar flex"
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          partners.map((partner) => (
            <div key={partner.mc_id} style={{ flex: '0 0 auto' }}>
              <PartnerCard
                partner={{
                  name: partner.mc_name,
                  logo: API_URLIMAGE + '/uploads/collaborations/' + partner.mc_image,
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

// Responsive styles
const styles: { [key: string]: React.CSSProperties } = {
  section: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '60px 20px',
  },
  description: {
    maxWidth: '700px',
    marginBottom: '40px',
    fontFamily: 'Rubik, sans-serif',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  logosContainer: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '1200px',
    padding: '10px 20px',
  },
};

// Tambah responsive rules
const mediaQuery = `
  @media (max-width: 768px) {
    section {
      padding: 25px 15px !important;
    }
    h2 {
      font-size: 1.5rem !important;
    }
    p {
      font-size: 0.9rem !important;
      margin: 0 auto 15px !important;
    }
  }

  @media (max-width: 480px) {
    h2 {
      font-size: 1.25rem !important;
    }
    p {
      font-size: 0.85rem !important;
    }
  }

  /* Hide scrollbar */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE & Edge */
    scrollbar-width: none;      /* Firefox */
  }
`;

// inject style ke head
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = mediaQuery;
  document.head.appendChild(styleTag);
}

export default Collaboration;