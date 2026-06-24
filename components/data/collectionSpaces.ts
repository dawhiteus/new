export interface CollectionSpace {
  id: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  type: 'Office Suite' | 'Team Office' | 'Coworking' | 'Private Office';
  capacity: string;
  price: number;
  isAvailable: boolean;
  amenities: string[];
  category: 'Recommended' | 'Saved' | 'Shortlisted';
}

const I = [
  'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=400&q=80',
  'https://images.unsplash.com/photo-1653463173471-a8230f38b3f1?w=400&q=80',
  'https://images.unsplash.com/photo-1596749853719-e6aa1dc2eabe?w=400&q=80',
  'https://images.unsplash.com/photo-1557804500-7a58fbcd4d1a?w=400&q=80',
  'https://images.unsplash.com/photo-1742440711276-679934f5b988?w=400&q=80',
  'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400&q=80',
];

export const COLLECTION_SPACES: Record<string, CollectionSpace[]> = {
  'New York': [
    { id: 'ny1', name: 'Convene — 530 Fifth Ave',       image: I[0], rating: 4.8, address: '530 Fifth Avenue, Midtown, NY 10036',          type: 'Office Suite',    capacity: '42 Desks',          price: 85000, isAvailable: true,  amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Kitchen'],  category: 'Recommended' },
    { id: 'ny2', name: 'WeWork — One World Trade',       image: I[1], rating: 4.7, address: '1 World Trade Center, Financial Dist, NY 10007', type: 'Team Office',     capacity: '87 Desks',          price: 145000, isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],     category: 'Recommended' },
    { id: 'ny3', name: 'Industrious — Park Avenue',      image: I[2], rating: 4.6, address: '450 Park Avenue, Midtown East, NY 10022',        type: 'Private Office',  capacity: '18 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Phone Booths', 'Kitchen'],         category: 'Saved' },
    { id: 'ny4', name: 'Regus — Times Square',           image: I[3], rating: 4.3, address: '1440 Broadway, Times Square, NY 10018',          type: 'Coworking',       capacity: '55 Desks',          price: 72000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Saved' },
    { id: 'ny5', name: 'Knotel — Flatiron',              image: I[4], rating: 4.5, address: '261 Fifth Avenue, Flatiron, NY 10016',            type: 'Team Office',     capacity: '65 Desks',          price: 98000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Rooftop Access', 'Kitchen'],      category: 'Shortlisted' },
  ],
  'Seattle': [
    { id: 'se1', name: 'WeWork — Capitol Hill',          image: I[1], rating: 4.7, address: '500 E Pine St, Capitol Hill, Seattle WA 98122',  type: 'Team Office',     capacity: '48 Desks',          price: 52000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'se2', name: 'Industrious — South Lake Union', image: I[2], rating: 4.6, address: '400 Westlake Ave N, Seattle WA 98109',            type: 'Office Suite',    capacity: '32 Desks',          price: 68000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Parking'], category: 'Saved' },
    { id: 'se3', name: 'Regus — Downtown Seattle',       image: I[3], rating: 4.2, address: '1001 4th Ave, Downtown, Seattle WA 98154',        type: 'Coworking',       capacity: '45 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'se4', name: 'Spaces — Pacific Place',         image: I[4], rating: 4.5, address: '600 Pine St, Downtown, Seattle WA 98101',         type: 'Team Office',     capacity: '60 Desks',          price: 78000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Shortlisted' },
    { id: 'se5', name: 'IWG — Pioneer Square',           image: I[5], rating: 4.1, address: '83 S King St, Pioneer Square, Seattle WA 98104', type: 'Private Office',  capacity: '14 Desks',          price: 24000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Saved' },
  ],
  'Dallas': [
    { id: 'da1', name: 'WeWork — Uptown',                image: I[2], rating: 4.6, address: '2811 McKinney Ave, Uptown, Dallas TX 75204',      type: 'Team Office',     capacity: '58 Desks',          price: 48000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'da2', name: 'Industrious — Deep Ellum',       image: I[3], rating: 4.5, address: '2600 Commerce St, Deep Ellum, Dallas TX 75226',   type: 'Office Suite',    capacity: '24 Desks',          price: 32000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Recommended' },
    { id: 'da3', name: 'Regus — Legacy West',            image: I[4], rating: 4.2, address: '7160 Dallas Pkwy, Plano TX 75024',                 type: 'Coworking',       capacity: '40 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking', '24/7 Access'],          category: 'Saved' },
    { id: 'da4', name: 'Spaces — Harwood District',      image: I[5], rating: 4.4, address: '2101 Cedar Springs Rd, Dallas TX 75201',           type: 'Team Office',     capacity: '36 Desks',          price: 42000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Rooftop Access'],                 category: 'Shortlisted' },
    { id: 'da5', name: 'IWG — Preston Center',           image: I[0], rating: 4.0, address: '8750 N Central Expy, Dallas TX 75231',             type: 'Private Office',  capacity: '20 Desks',          price: 22000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'Chicago': [
    { id: 'ch1', name: 'WeWork — Wacker Drive',          image: I[3], rating: 4.7, address: '20 W Kinzie St, River North, Chicago IL 60654',   type: 'Team Office',     capacity: '74 Desks',          price: 88000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'ch2', name: 'Convene — West Loop',            image: I[4], rating: 4.8, address: '311 W Monroe St, West Loop, Chicago IL 60606',     type: 'Office Suite',    capacity: '48 Desks',          price: 95000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Kitchen'], category: 'Saved' },
    { id: 'ch3', name: 'Industrious — River North',      image: I[5], rating: 4.5, address: '320 W Ohio St, River North, Chicago IL 60654',     type: 'Private Office',  capacity: '22 Desks',          price: 44000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Phone Booths'],                    category: 'Shortlisted' },
    { id: 'ch4', name: 'Regus — Millennium Park',        image: I[0], rating: 4.3, address: '55 E Monroe St, Loop, Chicago IL 60603',           type: 'Coworking',       capacity: '50 Desks',          price: 52000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'ch5', name: 'Spaces — Fulton Market',         image: I[1], rating: 4.4, address: '1000 W Fulton Market, Chicago IL 60607',           type: 'Team Office',     capacity: '38 Desks',          price: 58000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Saved' },
  ],
  'Boston': [
    { id: 'bo1', name: 'WeWork — South Station',         image: I[4], rating: 4.6, address: '745 Atlantic Ave, South Station, Boston MA 02111', type: 'Team Office',    capacity: '55 Desks',          price: 72000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'bo2', name: 'Industrious — Back Bay',         image: I[5], rating: 4.7, address: '800 Boylston St, Back Bay, Boston MA 02199',        type: 'Office Suite',   capacity: '28 Desks',          price: 58000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Recommended' },
    { id: 'bo3', name: 'Convene — Post Office Square',   image: I[0], rating: 4.8, address: '100 Oliver St, Financial Dist, Boston MA 02110',   type: 'Team Office',    capacity: '65 Desks',          price: 84000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Kitchen'], category: 'Saved' },
    { id: 'bo4', name: 'Regus — Financial District',     image: I[1], rating: 4.1, address: '60 State St, Financial Dist, Boston MA 02109',     type: 'Coworking',      capacity: '42 Desks',          price: 45000,  isAvailable: false, amenities: ['WiFi', 'Furnished', '24/7 Access'],                    category: 'Shortlisted' },
    { id: 'bo5', name: 'Serendipity Labs — Kenmore',     image: I[2], rating: 4.3, address: '1 Kenmore Sq, Fenway, Boston MA 02215',             type: 'Private Office', capacity: '18 Desks',          price: 32000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Saved' },
  ],
  'Atlanta': [
    { id: 'at1', name: 'WeWork — Colony Square',         image: I[5], rating: 5.0, address: '1175 Peachtree St NE, Midtown, Atlanta GA 30361', type: 'Office Suite',    capacity: '66 Desks',          price: 58000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'at2', name: 'Industrious — Peachtree',        image: I[0], rating: 4.6, address: '7000 Central Pkwy, Suite 1600, Atlanta GA 30328', type: 'Team Office',     capacity: '44 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'at3', name: 'Regus — Buckhead',               image: I[1], rating: 4.2, address: '3399 Peachtree Rd NE, Buckhead, Atlanta GA 30326', type: 'Coworking',      capacity: '36 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Recommended' },
    { id: 'at4', name: 'Spaces — Midtown',               image: I[2], rating: 4.4, address: '756 W Peachtree St NW, Midtown, Atlanta GA 30308', type: 'Team Office',    capacity: '52 Desks',          price: 48000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],          category: 'Shortlisted' },
    { id: 'at5', name: 'Convene — Downtown',             image: I[3], rating: 4.5, address: '191 Marietta St NW, Downtown, Atlanta GA 30303',  type: 'Office Suite',    capacity: '30 Desks',          price: 42000,  isAvailable: false, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],            category: 'Saved' },
  ],
  'Houston': [
    { id: 'ho1', name: 'WeWork — Discovery Green',       image: I[0], rating: 4.6, address: '708 Main St, Downtown, Houston TX 77002',          type: 'Team Office',     capacity: '62 Desks',          price: 54000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'ho2', name: 'Industrious — Midtown Houston',  image: I[1], rating: 4.5, address: '3200 Travis St, Midtown, Houston TX 77006',         type: 'Office Suite',    capacity: '26 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'ho3', name: 'Regus — Galleria',               image: I[2], rating: 4.2, address: '5065 Westheimer Rd, Galleria, Houston TX 77056',   type: 'Coworking',       capacity: '48 Desks',          price: 34000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking', '24/7 Access'],          category: 'Recommended' },
    { id: 'ho4', name: 'Spaces — Greenway Plaza',        image: I[3], rating: 4.3, address: '3 Greenway Plaza, Houston TX 77046',                type: 'Team Office',     capacity: '40 Desks',          price: 44000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space'],                    category: 'Shortlisted' },
    { id: 'ho5', name: 'IWG — Energy Corridor',          image: I[4], rating: 4.0, address: '15995 N Barkers Landing, Houston TX 77079',         type: 'Private Office',  capacity: '22 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'Austin': [
    { id: 'au1', name: 'WeWork — South Congress',        image: I[1], rating: 4.7, address: '1801 E 6th St, East Austin, Austin TX 78702',      type: 'Team Office',     capacity: '46 Desks',          price: 48000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'au2', name: 'Industrious — The Domain',       image: I[2], rating: 4.6, address: '11801 Domain Blvd, The Domain, Austin TX 78758',   type: 'Office Suite',    capacity: '22 Desks',          price: 36000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Recommended' },
    { id: 'au3', name: 'Regus — Downtown Austin',        image: I[3], rating: 4.1, address: '301 Congress Ave, Downtown, Austin TX 78701',       type: 'Coworking',       capacity: '38 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Saved' },
    { id: 'au4', name: 'Spaces — East Austin',           image: I[4], rating: 4.5, address: '979 Springdale Rd, East Austin, Austin TX 78702',  type: 'Team Office',     capacity: '55 Desks',          price: 52000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Shortlisted' },
    { id: 'au5', name: 'IWG — Rainey Street',            image: I[5], rating: 4.2, address: '84 E Rainey St, Rainey District, Austin TX 78701', type: 'Private Office',  capacity: '16 Desks',          price: 22000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Saved' },
  ],
  'Washington DC': [
    { id: 'dc1', name: 'WeWork — Georgetown',            image: I[2], rating: 4.7, address: '1000 Potomac St NW, Georgetown, DC 20007',          type: 'Office Suite',    capacity: '52 Desks',          price: 78000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'dc2', name: 'Convene — K Street',             image: I[3], rating: 4.8, address: '1201 K St NW, Downtown, DC 20005',                  type: 'Team Office',     capacity: '62 Desks',          price: 85000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Kitchen'], category: 'Saved' },
    { id: 'dc3', name: 'Industrious — Capitol Hill',     image: I[4], rating: 4.5, address: '20 F St NW, Capitol Hill, DC 20001',                type: 'Team Office',     capacity: '36 Desks',          price: 58000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Recommended' },
    { id: 'dc4', name: 'Regus — Downtown DC',            image: I[5], rating: 4.2, address: '1300 I St NW, Downtown, DC 20005',                  type: 'Coworking',       capacity: '44 Desks',          price: 52000,  isAvailable: false, amenities: ['WiFi', 'Furnished', '24/7 Access'],                    category: 'Shortlisted' },
    { id: 'dc5', name: 'IWG — Bethesda',                 image: I[0], rating: 4.1, address: '4800 Hampden Ln, Bethesda MD 20814',                type: 'Private Office',  capacity: '18 Desks',          price: 32000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'Miami': [
    { id: 'mi1', name: 'WeWork — Wynwood',               image: I[3], rating: 4.7, address: '2750 NW 3rd Ave, Wynwood, Miami FL 33127',          type: 'Team Office',     capacity: '46 Desks',          price: 52000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'mi2', name: 'Industrious — Brickell',         image: I[4], rating: 4.6, address: '1221 Brickell Ave, Brickell, Miami FL 33131',        type: 'Office Suite',    capacity: '24 Desks',          price: 44000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'mi3', name: 'Regus — Downtown Miami',         image: I[5], rating: 4.2, address: '100 SE 2nd St, Downtown, Miami FL 33131',            type: 'Coworking',       capacity: '40 Desks',          price: 32000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'mi4', name: 'Spaces — Design District',       image: I[0], rating: 4.5, address: '140 NE 39th St, Design District, Miami FL 33137',   type: 'Team Office',     capacity: '56 Desks',          price: 62000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Rooftop Access', 'Kitchen'],      category: 'Shortlisted' },
    { id: 'mi5', name: 'Convene — Biscayne',             image: I[1], rating: 4.4, address: '1450 Biscayne Blvd, Edgewater, Miami FL 33132',     type: 'Private Office',  capacity: '20 Desks',          price: 36000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Phone Booths'],                    category: 'Saved' },
  ],
  'Los Angeles': [
    { id: 'la1', name: 'WeWork — Culver City',           image: I[4], rating: 4.7, address: '8605 Santa Monica Blvd, Culver City CA 90069',      type: 'Team Office',     capacity: '66 Desks',          price: 72000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'la2', name: 'Industrious — Santa Monica',     image: I[5], rating: 4.6, address: '520 Broadway, Santa Monica CA 90401',                type: 'Office Suite',    capacity: '32 Desks',          price: 68000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'la3', name: 'Regus — Century City',           image: I[0], rating: 4.3, address: '1800 Century Park E, Century City CA 90067',         type: 'Coworking',       capacity: '52 Desks',          price: 58000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking', '24/7 Access'],          category: 'Recommended' },
    { id: 'la4', name: 'Spaces — Downtown LA',           image: I[1], rating: 4.5, address: '700 S Flower St, Downtown, Los Angeles CA 90017',   type: 'Team Office',     capacity: '72 Desks',          price: 88000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Shortlisted' },
    { id: 'la5', name: 'Convene — Beverly Hills',        image: I[2], rating: 4.8, address: '9454 Wilshire Blvd, Beverly Hills CA 90212',         type: 'Office Suite',    capacity: '26 Desks',          price: 78000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Parking'], category: 'Saved' },
  ],
  'Philadelphia': [
    { id: 'ph1', name: 'WeWork — Center City',           image: I[5], rating: 4.6, address: '1900 Market St, Center City, Philadelphia PA 19103', type: 'Team Office',   capacity: '56 Desks',          price: 54000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'ph2', name: 'Industrious — Old City',         image: I[0], rating: 4.5, address: '325 Chestnut St, Old City, Philadelphia PA 19106',  type: 'Office Suite',    capacity: '24 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'ph3', name: 'Regus — University City',        image: I[1], rating: 4.1, address: '3600 Market St, University City, Philadelphia PA 19104', type: 'Coworking', capacity: '38 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'ph4', name: 'Spaces — Navy Yard',             image: I[2], rating: 4.4, address: '4101 S Broad St, Navy Yard, Philadelphia PA 19112', type: 'Team Office',     capacity: '48 Desks',          price: 46000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space'],                    category: 'Shortlisted' },
    { id: 'ph5', name: 'IWG — Rittenhouse',              image: I[3], rating: 4.0, address: '1700 Market St, Rittenhouse, Philadelphia PA 19103', type: 'Private Office', capacity: '16 Desks',          price: 24000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'Denver': [
    { id: 'de1', name: 'WeWork — LoDo',                  image: I[0], rating: 4.6, address: '1601 Wewatta St, LoDo, Denver CO 80202',             type: 'Team Office',     capacity: '52 Desks',          price: 46000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'de2', name: 'Industrious — RiNo',             image: I[1], rating: 4.5, address: '3001 Brighton Blvd, RiNo, Denver CO 80216',           type: 'Office Suite',    capacity: '22 Desks',          price: 34000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'de3', name: 'Regus — Cherry Creek',           image: I[2], rating: 4.2, address: '44 Cook St, Cherry Creek, Denver CO 80206',           type: 'Coworking',       capacity: '40 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'de4', name: 'Spaces — Colfax',                image: I[3], rating: 4.3, address: '3000 E Colfax Ave, Denver CO 80206',                  type: 'Team Office',     capacity: '46 Desks',          price: 42000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Shortlisted' },
    { id: 'de5', name: 'Serendipity Labs — Union Station', image: I[4], rating: 4.4, address: '1701 Wynkoop St, Union Station, Denver CO 80202', type: 'Private Office',  capacity: '18 Desks',          price: 26000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Saved' },
  ],
  'Portland': [
    { id: 'po1', name: 'WeWork — Pearl District',        image: I[1], rating: 4.6, address: '1 SW Columbia St, Pearl Dist, Portland OR 97201',   type: 'Team Office',     capacity: '42 Desks',          price: 38000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'po2', name: 'Industrious — Downtown Portland', image: I[2], rating: 4.4, address: '610 SW Alder St, Downtown, Portland OR 97205',      type: 'Office Suite',    capacity: '20 Desks',          price: 28000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'po3', name: 'Regus — South Waterfront',       image: I[3], rating: 4.1, address: '3201 SW Moody Ave, South Waterfront, Portland OR 97239', type: 'Coworking',  capacity: '34 Desks',          price: 22000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Recommended' },
    { id: 'po4', name: 'Spaces — Alberta Arts',          image: I[4], rating: 4.3, address: '4110 NE Alberta St, Alberta Arts, Portland OR 97218', type: 'Team Office',   capacity: '36 Desks',          price: 32000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space'],                    category: 'Shortlisted' },
    { id: 'po5', name: 'IWG — Lloyd District',           image: I[5], rating: 4.0, address: '1001 NE Lloyd Blvd, Lloyd District, Portland OR 97232', type: 'Private Office', capacity: '14 Desks',       price: 18000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'Nashville': [
    { id: 'na1', name: 'WeWork — The Gulch',             image: I[2], rating: 4.7, address: '1033 Demonbreun St, The Gulch, Nashville TN 37203', type: 'Team Office',     capacity: '46 Desks',          price: 42000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'na2', name: 'Industrious — Germantown',       image: I[3], rating: 4.5, address: '1100 Broadway, Germantown, Nashville TN 37203',       type: 'Office Suite',    capacity: '22 Desks',          price: 32000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'na3', name: 'Regus — Downtown Nashville',     image: I[4], rating: 4.2, address: '150 4th Ave N, Downtown, Nashville TN 37219',         type: 'Coworking',       capacity: '38 Desks',          price: 26000,  isAvailable: true, amenities: ['WiFi', 'Furnished', '24/7 Access'],                     category: 'Recommended' },
    { id: 'na4', name: 'Spaces — Midtown Nashville',     image: I[5], rating: 4.4, address: '2002 Richard Jones Rd, Midtown, Nashville TN 37215', type: 'Team Office',     capacity: '52 Desks',          price: 48000,  isAvailable: false, amenities: ['WiFi', 'Furnished', 'Event Space', 'Kitchen'],         category: 'Shortlisted' },
    { id: 'na5', name: 'IWG — Cool Springs',             image: I[0], rating: 4.0, address: '1720 General George Patton Dr, Brentwood TN 37027', type: 'Private Office',  capacity: '16 Desks',          price: 22000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Parking'],                         category: 'Saved' },
  ],
  'San Francisco': [
    { id: 'sf1', name: 'WeWork — Mission District',      image: I[3], rating: 4.7, address: '25 Taylor St, Tenderloin, San Francisco CA 94102',  type: 'Team Office',     capacity: '62 Desks',          price: 82000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],    category: 'Recommended' },
    { id: 'sf2', name: 'Industrious — SoMa',             image: I[4], rating: 4.6, address: '156 2nd St, SoMa, San Francisco CA 94105',           type: 'Office Suite',    capacity: '28 Desks',          price: 68000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment'],             category: 'Saved' },
    { id: 'sf3', name: 'Convene — Embarcadero',          image: I[5], rating: 4.8, address: '101 Spear St, Embarcadero, San Francisco CA 94105', type: 'Team Office',     capacity: '72 Desks',          price: 96000,  isAvailable: true, amenities: ['WiFi', 'Hosted Reception', 'AV Equipment', 'Kitchen'], category: 'Recommended' },
    { id: 'sf4', name: 'Regus — Financial District SF',  image: I[0], rating: 4.3, address: '388 Market St, Financial Dist, San Francisco CA 94111', type: 'Coworking',   capacity: '48 Desks',          price: 62000,  isAvailable: false, amenities: ['WiFi', 'Furnished', '24/7 Access'],                    category: 'Shortlisted' },
    { id: 'sf5', name: 'Spaces — Hayes Valley',          image: I[1], rating: 4.4, address: '340 Pine St, Financial Dist, San Francisco CA 94104', type: 'Private Office', capacity: '20 Desks',         price: 44000,  isAvailable: true, amenities: ['WiFi', 'Furnished', 'Bike Storage'],                    category: 'Saved' },
  ],
};

export function getCollectionSpaces(city: string): CollectionSpace[] {
  return COLLECTION_SPACES[city] ?? COLLECTION_SPACES['New York'];
}
