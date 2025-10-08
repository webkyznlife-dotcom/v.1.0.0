
import above_foodLogo from '../../../../../assets/images/collaboration/above_food.png';
import audy_dental_clinicLogo from '../../../../../assets/images/collaboration/audy_dental_clinic.png';
import briLogo from '../../../../../assets/images/collaboration/bri.png';
import down_blibliLogo from '../../../../../assets/images/collaboration/down_blibli.png';
import down_bniLogo from '../../../../../assets/images/collaboration/down_bni.png';
import down_creathleteLogo from '../../../../../assets/images/collaboration/down_creathlete.png';
import down_eagleLogo from '../../../../../assets/images/collaboration/down_eagle.png';
import down_medifitLogo from '../../../../../assets/images/collaboration/down_medifit.png';
import down_onaLogo from '../../../../../assets/images/collaboration/down_ona.png';
import down_sinar_masLogo from '../../../../../assets/images/collaboration/down_sinar_mas.png';
import down_travelokaLogo from '../../../../../assets/images/collaboration/down_traveloka.png';
import edgeLogo from '../../../../../assets/images/collaboration/edge.png';
import KOMPASLogo from '../../../../../assets/images/collaboration/kompas.png';
import leevierraLogo from '../../../../../assets/images/collaboration/leevierra.png';
import senayan_batting_centerLogo from '../../../../../assets/images/collaboration/senayan_batting_center.png';
import tangerang_hawksLogo from '../../../../../assets/images/collaboration/tangerang_hawks.png';
import viumiLogo from '../../../../../assets/images/collaboration/viumi.png';


export interface Partner {
  name: string;
  logo: string;
  link?: string;
}

export const partners: Partner[] = [
  { name: 'above_food', logo: above_foodLogo },
  { name: 'audy_dental_clinic', logo: audy_dental_clinicLogo },
  { name: 'bri', logo: briLogo },
  { name: 'down_blibli', logo: down_blibliLogo },
  { name: 'down_bni', logo: down_bniLogo },
  { name: 'down_creathlete', logo: down_creathleteLogo },
  { name: 'down_eagle', logo: down_eagleLogo },
  { name: 'down_medifit', logo: down_medifitLogo },
  { name: 'down_ona', logo: down_onaLogo },
  { name: 'down_sinar_mas', logo: down_sinar_masLogo },
  { name: 'down_traveloka', logo: down_travelokaLogo },
  { name: 'edge', logo: edgeLogo },
  { name: 'KOMPAS', logo: KOMPASLogo },
  { name: 'leevierra', logo: leevierraLogo },
  { name: 'senayan_batting_center', logo: senayan_batting_centerLogo},
  { name: 'tangerang_hawks', logo: tangerang_hawksLogo},
  { name: 'viumi', logo: viumiLogo}
  // ... partner lainnya
];
