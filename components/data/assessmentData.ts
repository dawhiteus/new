// Real data recorded from LiquidSpace (Pulse: Workspaces and Venues), for the Assessment prototype.
// The browser demo cannot call Pulse, so each collection's spaces and a pool of nearby listings are recorded here.
import { SAMPLE_INVENTORY, REAL_COLLECTIONS, type Venue } from './collectionAgent';

export interface AssessSpace {
  id: string;
  url: string;
  venue: string;
  title: string;
  type: string;
  desks: number;
  rate: number | null; // monthly, local currency
  lat: number;
  lng: number;
  modified: string; // ISO: listing last updated
  booking?: string;
  responseMin?: number; // venue's average lead response, minutes (0 = no data)
  minTerm?: string;
  inCollection: boolean;
  /** Public listings are on the marketplace; private ones are created from a venue's proposal. Default Public. */
  visibility?: 'Public' | 'Private';
  /** Private only: the quote's valid-until date (ISO). */
  validUntil?: string;
  /** Private only: when the venue says the space is available (ISO). */
  availableFrom?: string;
  /** Added by hand to the collection after it was built. */
  addedByHand?: boolean;
}

/** Search centers: the city center. Used when a Requirement gives no search area. */
export const CENTERS: Record<string, { lat: number; lng: number; label: string }> = {
  austin: { lat: 30.2672, lng: -97.7431, label: 'downtown Austin' },
  chicago: { lat: 41.8781, lng: -87.6298, label: 'the Loop' },
  minneapolis: { lat: 44.9778, lng: -93.265, label: 'downtown Minneapolis' },
  dallas: { lat: 32.7767, lng: -96.797, label: 'downtown Dallas' },
  'new york': { lat: 40.758, lng: -73.9855, label: 'Midtown' },
  porto: { lat: 41.1579, lng: -8.6291, label: 'central Porto' },
  denver: { lat: 39.7508, lng: -104.9966, label: 'downtown Denver' },
  lisbon: { lat: 38.7223, lng: -9.1393, label: 'central Lisbon' },
};

// Collection members: url (after "https://liquidspace.c") | lat | lng | modified | booking | venue response (min)
const MEMBER_META = `om/us/tx/austin/novel-coworking-north-austin/club-suite-200c-copy|30.4436|-97.6958|2026-11-03|Request to Book|1181
om/us/tx/austin/dwell-coworking-downtown/office-suite-3|30.2597|-97.7326|2026-11-02|Request to Book|0
om/us/tx/austin/expansive-austin-highland/club-suite-200e-copy|30.3304|-97.7105|2026-11-02|Request to Book|351
om/us/tx/austin/indy-by-industrious/ausbur220|30.3467|-97.7361|2026-10-08|Inquire Now|0
om/us/tx/austin/regus-westlake/team-office-3168|30.2810|-97.8238|2026-10-08|Inquire Now|0
om/us/tx/austin/regus-aspen-lake-one/team-office-df64|30.4632|-97.7931|2026-10-08|Inquire Now|0
om/us/tx/austin/regus-river-place/team-office-7a45|30.3966|-97.8519|2026-10-08|Inquire Now|0
om/us/tx/austin/regus-dobie-center/team-office-ccd8|30.2832|-97.7415|2026-10-08|Inquire Now|8582
om/us/il/chicago/level-office/office-suite-1300c-copy|41.8794|-87.6360|2026-11-04|Request to Book|16790
om/us/il/chicago/expansive-river-north-superior/office-suite-100b-copy-37c1|41.8953|-87.6390|2026-11-03|Request to Book|428
om/us/il/chicago/expansive-stetson-ave/team-suite-3300a-copy-1041|41.8854|-87.6227|2026-11-03|Request to Book|0
om/us/il/chicago/working-from/private-studio-411|41.8859|-87.6488|2026-10-26|Request to Book|33983
om/us/il/chicago/level-office-211-w-wacker/office-suite-1500a-copy-6189|41.8865|-87.6346|2026-11-04|Request to Book|33314
om/us/il/chicago/workbox-the-loop/office-1-6146|41.8799|-87.6305|2026-11-02|Request to Book|0
om/us/il/chicago/industrious-millennium-park-chicago/chi24e116|41.8833|-87.6270|2026-10-08|Inquire Now|0
om/us/il/chicago/regus-west-loop-200-s-wacker/team-office-2c31|41.8792|-87.6374|2026-10-08|Inquire Now|0
om/us/tx/dallas/8330-lbj-freeway/suite-b725ws|32.9229|-96.7590|2026-10-26|Inquire Now|8180
om/us/tx/dallas/1910-pacific-place/suite-18100|32.7826|-96.7954|2026-10-30|Inquire Now|1048
om/us/tx/dallas/carillon-towers/suite-w0900|32.9334|-96.8065|2026-11-04|Inquire Now|8182
om/us/tx/dallas/boxer-northbrook-atrium-plaza/suite-1310|32.8612|-96.8858|2026-11-04|Inquire Now|0
om/us/tx/dallas/4100-spring-valley-rd/suite-100ws|32.9394|-96.8372|2026-11-03|Inquire Now|6827
om/us/tx/dallas/boxer-office-alpha/suite-405|32.9270|-96.7684|2026-10-07|Inquire Now|5354
om/us/tx/dallas/boxer-14800-quorum/suite-200|32.9491|-96.8251|2026-10-26|Inquire Now|3025
om/us/tx/dallas/level-office-701commerce/club-suite-200b-copy-2e9c|32.7788|-96.8057|2026-11-03|Request to Book|0
om/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600b-copy-9c5a|44.9786|-93.2665|2026-11-04|Request to Book|0
om/us/mn/minneapolis/industrious-minneapolis-north-loop/minlop002suite|44.9842|-93.2750|2026-10-08|Inquire Now|0
om/us/mn/minneapolis/regus-minneapolis-washington-ave/team-office-c8ad|44.9845|-93.2739|2026-10-08|Inquire Now|0
om/us/mn/minneapolis/regus-minnesota-center/team-office-6896|44.8612|-93.3315|2026-10-08|Inquire Now|8121
om/us/mn/minneapolis/regus-spaces-north-loop/team-office-d119|44.9832|-93.2714|2026-10-08|Inquire Now|82699
om/us/mn/minneapolis/regus-minnesota-bloomington-normandale-lake/team-office-1370|44.8532|-93.3556|2026-10-08|Inquire Now|0
om/us/mn/minneapolis/regus-minneapolis-lagoon-ave/team-office-1bd5|44.9490|-93.2973|2026-10-08|Inquire Now|0
om/us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office-b8bb|44.9774|-93.2688|2026-10-08|Inquire Now|0
om/us/ny/new-york/jay-suites-chelsea/suite-802-abc|40.7453|-73.9939|2026-09-08|Request to Book|169
om/us/ny/new-york/53-beach-street/office-suite-1|40.7209|-74.0094|2026-10-05|Request to Book|15
om/us/ny/new-york/full-floor-penn-station-office/full-office-copy|40.7509|-73.9940|2026-10-05|Request to Book|19610
om/us/ny/new-york/workville/team-office-18-person-capacity-copy-copy|40.7536|-73.9865|2026-04-06|Request to Book|37597
om/us/ny/new-york/tower-49-by-industrious/nyctwr206|40.7572|-73.9770|2026-10-08|Inquire Now|17541
om/us/ny/new-york/jay-suites-38th-street-new-york/private-office-suite-12-floor|40.7516|-73.9837|2026-09-08|Request to Book|16
om/us/ny/new-york/bevmax-office-centers-plaza-district/suite-39|40.7646|-73.9701|2026-11-02|Request to Book|0
om/us/ny/new-york/select-office-suites-flatiron/40-person-windowed-team-room|40.7429|-73.9893|2026-10-29|Request to Book|11711
om/pt/porto/porto/vertical-coworking-dom-henrique/office-3|41.1523|-8.6072|2026-06-18|Request to Book|0
om/pt/porto/porto/regus-regus-porto-s-bento/team-office-ee24|41.1438|-8.6081|2026-10-08|Inquire Now|0
om/pt/porto-district/porto/regus-porto-batalha/team-office-0582|41.1575|-8.6279|2026-10-08|Inquire Now|0`;

// Collections built outside the inventory table: url | venue | title | lat | lng | modified | booking | type | desks | rate | minimum term
const DENVER_MEMBERS = `om/us/co/denver/wework-the-circa-building/coworking-desk|WeWork | The Circa Building|Coworking Desk|39.7579|-105.0080|2026-04-02|Request to Book|Coworking|35|
om/us/co/denver/venture-x-denver-downtown-16th-street/dedicated-desk-1|Venture X | Denver - Uptown|Dedicated Desk|39.7415|-104.9878|2026-01-05|Request to Book|Dedicated Desk|10|299
om/us/co/denver/venture-x-lodo/dedicated-desk-1|Venture X | LoDo|Dedicated Desk 1|39.7534|-104.9968|2026-10-05|Request to Book|Dedicated Desk|6|599
om/us/co/denver/industrious-lohi/denlohi136|Industrious - LoHi|DenLoHi136|39.7619|-105.0127|2026-10-08|Inquire Now|Private Office|5|4783
om/us/co/denver/industrious-lohi/denlohi210|Industrious - LoHi|DenLoHi210|39.7619|-105.0127|2026-10-08|Inquire Now|Private Office|5|5115`;

const LISBON_MEMBERS = `om/pt/lisboa/lisboa/ladera-corporate-terrace/1-4-person-corner-window|LACS Conde d’Óbidos|1-5 person corner window|38.7033|-9.1625|2026-10-02|Request to Book|Private Office|5|1911|1 month
om/pt/lisboa/lisboa/av-republic/office-17-6-person-office-copy|Avila Spaces REPUBLIC|Office 7.08|38.7351|-9.1454|2026-10-02|Request to Book|Team Office|6|2400|12 months
om/pt/lisboa/lisboa/venture-x-portugal/office-4|Venture X | Portugal|Office 4|38.7226|-9.1470|2026-09-08|Request to Book|Private Office|3|1476|1 month
om/pt/lisboa/lisboa/maleo-saldanha/office-suite-1|Maleo Saldanha|10-Person Office|38.7360|-9.1450|2026-08-17|Request to Book|Office Suite|10|4350|12 months
om/pt/lisboa/lisboa/av-republic/office-1|Avila Spaces REPUBLIC|Office 17, 6 person office|38.7351|-9.1454|2026-10-02|Request to Book|Team Office|6|1890|6 months
om/pt/lisboa/lisbon/regus-lisbon-parque-das-na231245es/private-office-05f8|Regus | LISBON, Parque das Nacoes|Private Office|38.7708|-9.0972|2026-10-08|Inquire Now|Private Office|3|1009|1 month`;

const REAL_MEMBERS: Record<string, string> = { denver: DENVER_MEMBERS, lisbon: LISBON_MEMBERS };

// Nearby public monthly listings (nearest first). Pool lines: url (after "https://liquidspace.co") | venue | title | type | desks | rate | lat | lng | modified
const POOL: Record<string, string> = {
  lisbon: `m/pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade/team-office-41c4|Regus | LISBON, Avenida da Liberdade|Team Office|Team Office|5|1128|38.719|-9.144|2026-10-08
m/pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade/team-office-d10a|Regus | LISBON, Avenida da Liberdade|Team Office|Team Office|10|2386|38.719|-9.144|2026-10-08
m/pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade/private-office-bcb8|Regus | LISBON, Avenida da Liberdade|Private Office|Private Office|4|948|38.719|-9.144|2026-10-08
m/pt/lisboa/lisboa/venture-x-portugal/office-2|Venture X | Portugal|Office 2|Private Office|4|1600|38.723|-9.147|2026-09-08
m/pt/lisboa/lisboa/venture-x-portugal/office-18-copy|Venture X | Portugal|Office 1|Team Office|6|2200|38.723|-9.147|2026-09-08
m/pt/lisboa/lisboa/venture-x-portugal/office-23-caf1|Venture X | Portugal|Office 23|Private Office|6|2350|38.723|-9.147|2026-09-08
m/pt/lisboa/lisboa/venture-x-portugal/office-3|Venture X | Portugal|Office 3|Private Office|4|1200|38.723|-9.147|2026-09-08
m/pt/lisbon/lisbon/spaces-lisbon-marques-de-pombal/private-office-fe67|SPACES | LISBON, Marques de Pombal|Private Office|Private Office|4|1239|38.726|-9.149|2026-10-08
m/pt/lisbon/lisbon/spaces-lisbon-marques-de-pombal/team-office|SPACES | LISBON, Marques de Pombal|Team Office|Team Office|5|1847|38.726|-9.149|2026-10-08`,
  chicago: `m/us/il/chicago/regus-111-w-jackson/team-office-bb83|Regus | 111 W. Jackson|Team Office|Team Office|15|4046|41.878|-87.631|2026-10-08
m/us/il/chicago/regus-111-w-jackson/team-office-9d23|Regus | 111 W. Jackson|Team Office|Team Office|5|1438|41.878|-87.631|2026-10-08
m/us/il/chicago/regus-111-w-jackson/private-office-1d56|Regus | 111 W. Jackson|Private Office|Private Office|4|1079|41.878|-87.631|2026-10-08
m/us/il/chicago/regus-111-w-jackson/team-office-fdd4|Regus | 111 W. Jackson|Team Office|Team Office|10|2697|41.878|-87.631|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla094|Industrious - Central Loop|CHISLA094|Private Office|10|8662|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla093|Industrious - Central Loop|CHISLA093|Private Office|8|5756|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla085|Industrious - Central Loop|CHISLA085|Private Office|4|4209|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla077|Industrious - Central Loop|CHISLA077|Private Office|5|3843|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla071|Industrious - Central Loop|CHISLA071|Private Office|4|3365|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla054|Industrious - Central Loop|CHISLA054|Private Office|4|4721|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla051|Industrious - Central Loop|CHISLA051|Private Office|6|4709|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla045|Industrious - Central Loop|CHISLA045|Private Office|8|5406|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla033|Industrious - Central Loop|CHISLA033|Private Office|7|5095|41.879|-87.632|2026-10-08
m/us/il/chicago/industrious-chicago-central-loop/chisla023|Industrious - Central Loop|CHISLA023|Private Office|6|5063|41.879|-87.632|2026-10-08`,
  porto: `m/pt/porto-district/porto/regus-porto-batalha/team-office-8911|Regus | Porto, Batalha|Team Office|Team Office|5|1018|41.157|-8.628|2026-10-08
m/pt/porto-district/porto/regus-porto-batalha/team-office-6505|Regus | Porto, Batalha|Team Office|Team Office|10|1907|41.157|-8.628|2026-10-08
m/pt/porto/vila-nova-de-gaia/regus-gaia-arrabida/team-office-de19|Regus | GAIA, Arrabida|Team Office|Team Office|15|3776|41.143|-8.640|2026-10-08
m/pt/porto/vila-nova-de-gaia/regus-gaia-arrabida/team-office|Regus | GAIA, Arrabida|Team Office|Team Office|5|1198|41.143|-8.640|2026-10-08
m/pt/porto/porto/vertical-coworking-dom-henrique/office-2|Vertical Coworking Dom Henrique|Office 2|Private Office|10|3517|41.152|-8.607|2026-06-18
m/pt/porto/porto/vertical-coworking-dom-henrique/office-1|Vertical Coworking Dom Henrique|Office 1|Private Office|8|2395|41.152|-8.607|2026-06-18
m/pt/porto/porto/work-wise-co-working-offices/office-1|Work Wise | Co-Working & Offices|Bright start-up Private Office|Private Office|22|1500|41.152|-8.606|2024-05-06
m/pt/porto/porto/regus-regus-porto-s-bento/team-office-5bdc|Regus | Regus Porto S. Bento|Team Office|Team Office|10|1718|41.144|-8.608|2026-10-08
m/pt/porto/matosinhos/spaces-matosinhos-spaces-matosinhos/team-office-dafb|SPACES | Matosinhos|Team Office|Team Office|15|4136|41.179|-8.685|2026-10-08
m/pt/porto/matosinhos/spaces-matosinhos-spaces-matosinhos/team-office-b8f0|SPACES | Matosinhos|Team Office|Team Office|10|2757|41.179|-8.685|2026-10-08`,
  denver: `m/us/co/denver/regus-denver-place-denver-1/team-office-2815|Regus || Denver Place|Team Office|Team Office|15|3176|39.749|-104.991|2026-10-08
m/us/co/denver/regus-denver-place-denver-1/team-office-4ce7|Regus || Denver Place|Team Office|Team Office|10|1786|39.749|-104.991|2026-10-08
m/us/co/denver/candy-factory-coworking/private-office-for-8-10-people|Candy Factory Coworking|Large Office in Historic Building|Private Office|12|3000|39.746|-104.995|2026-03-02
m/us/co/denver/candy-factory-coworking/office-for-6-copy|Candy Factory Coworking|Office for 6|Private Office|6|1348|39.746|-104.995|2024-10-07
m/us/co/denver/serendipity-labs-denver-lodo/20-person-offices|Serendipity Labs - Denver - LoDo|20 Person Office|Team Office|20|9980|39.756|-105.000|2026-11-02
m/us/co/denver/serendipity-labs-denver-lodo/10-person-office|Serendipity Labs - Denver - LoDo|10 Person Office|Team Office|10|4990|39.756|-105.000|2026-11-02
m/us/co/denver/serendipity-labs-denver-lodo/8-person-office|Serendipity Labs - Denver - LoDo|8 Person Office|Team Office|8|3992|39.756|-105.000|2026-11-02
m/us/co/denver/serendipity-labs-denver-lodo/5-person-office|Serendipity Labs - Denver - LoDo|5 Person Office|Team Office|5|2495|39.756|-105.000|2026-11-02
m/us/co/denver/industrious-denver/dencal091|Industrious - Central Business District|DENCAL091|Private Office|7|6693|39.748|-104.989|2026-10-08
m/us/co/denver/industrious-denver/dencal060|Industrious - Central Business District|DENCAL060|Private Office|6|5176|39.748|-104.989|2026-10-08
m/us/co/denver/industrious-denver/dencal040|Industrious - Central Business District|DENCAL040|Private Office|4|3765|39.748|-104.989|2026-10-08`,
  dallas: `m/us/tx/dallas/1910-pacific-place/suite-1100|Boxer - Pacific Place|Suite 1100|Office Suite|27|3699|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-15400|Boxer - Pacific Place|Suite 15400|Office Suite|21|2899|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-10500|Boxer - Pacific Place|Suite 10500|Office Suite|35|4677|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-12030|Boxer - Pacific Place|Suite 12030|Office Suite|20|2777|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-9350|Boxer - Pacific Place|Suite 9350|Office Suite|19|2509|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-9050|Boxer - Pacific Place|Suite 9050|Office Suite|11|1615|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-5045|Boxer - Pacific Place|Suite 5045|Office Suite|52|6831|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-6050|Boxer - Pacific Place|Suite 6050|Office Suite|19|2652|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-14250-cffe|Boxer - Pacific Place|Suite 14250|Office Suite|22|3229|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-11400|Boxer - Pacific Place|Suite 11400|Office Suite|38|5289|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-2090-8537|Boxer - Pacific Place|Suite 2090|Office Suite|40|5163|32.783|-96.795|2026-10-30
m/us/tx/dallas/1910-pacific-place/suite-8065|Boxer - Pacific Place|Suite 8065|Office Suite|16|2231|32.783|-96.795|2026-10-30`,
  austin: `m/us/tx/austin/industrious-austin/ausdtn097|Industrious - 5th and Colorado|AUSDTN097|Private Office|4|4484|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn094|Industrious - 5th and Colorado|AUSDTN094|Private Office|6|6762|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn092|Industrious - 5th and Colorado|AUSDTN092|Private Office|8|7617|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn128|Industrious - 5th and Colorado|AUSDTN128|Private Office|8|11107|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn117|Industrious - 5th and Colorado|AUSDTN117|Private Office|7|10517|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn079|Industrious - 5th and Colorado|AUSDTN079|Private Office|6|7366|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn078|Industrious - 5th and Colorado|AUSDTN078|Private Office|4|3770|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn031|Industrious - 5th and Colorado|AUSDTN031|Private Office|4|5633|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn024|Industrious - 5th and Colorado|AUSDTN024|Private Office|4|5893|30.267|-97.745|2026-10-08
m/us/tx/austin/industrious-austin/ausdtn016|Industrious - 5th and Colorado|AUSDTN016|Private Office|8|9607|30.267|-97.745|2026-10-08`,
  minneapolis: `m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-500c-copy|Expansive - TriTech Center|Office Suite 500I|Office Suite|34|6499|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-500b-copy|Expansive - TriTech Center|Office Suite 500E|Office Suite|21|3624|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600e-copy-2|Expansive - TriTech Center|Office Suite 700D|Office Suite|15|1999|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600d-copy|Expansive - TriTech Center|Office Suite 500H|Office Suite|17|2999|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600c-copy|Expansive - TriTech Center|Office Suite 700C|Office Suite|24|4249|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-500h-copy|Expansive - TriTech Center|Office Suite 500B|Office Suite|21|3999|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-7|Expansive - TriTech Center|Office Suite 500G|Office Suite|16|2124|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/novel-coworking-minneapolis/club-suite-107-copy-95d1|Expansive - TriTech Center|Club Suite 700E|Office Suite|18|2624|44.979|-93.266|2026-11-04
m/us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office|Regus | MN, Minneapolis - South 6th St|Team Office|Team Office|5|1887|44.977|-93.269|2026-10-08
m/us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office-db31|Regus | MN, Minneapolis - South 6th St|Team Office|Team Office|10|3676|44.977|-93.269|2026-10-08
m/us/mn/minneapolis/industrious-minneapolis-downtown/mindtn040|Industrious - Downtown Minneapolis|MINDTN040|Private Office|13|9802|44.978|-93.271|2026-10-08`,
  'new york': `m/us/ny/new-york/emerge212-1185-avenue-of-the-americas/team-room-215217|Emerge212 - 1185 Avenue of the Americas|Team Room #215/217|Team Office|22|20000|40.758|-73.982|2026-10-13
m/us/ny/new-york/emerge212-1185-avenue-of-the-americas/team-room-311-with-interior-call-room|Emerge212 - 1185 Avenue of the Americas|Team Room #311|Team Office|9|9900|40.758|-73.982|2026-10-13
m/us/ny/new-york/emerge212-1185-avenue-of-the-americas/team-room-219|Emerge212 - 1185 Avenue of the Americas|Team Room #219|Private Office|17|18500|40.758|-73.982|2026-10-13
m/us/ny/new-york/regus-americas-tower/team-office-c7b9|Regus | Americas Tower|Team Office|Team Office|15|7716|40.757|-73.982|2026-10-08
m/us/ny/new-york/regus-americas-tower/team-office-d03a|Regus | Americas Tower|Team Office|Team Office|10|5236|40.757|-73.982|2026-10-08
m/us/ny/new-york/regus-americas-tower/team-office-2f1f|Regus | Americas Tower|Team Office|Team Office|5|2418|40.757|-73.982|2026-10-08
m/us/ny/new-york/industrious-indy-by-industrious-times-square/nyctim2110|Indy by Industrious Times Square|NYCTIM2110|Private Office|8|11289|40.755|-73.988|2026-10-08
m/us/ny/new-york/jay-suites/windowed-team-office-for-up-to-15-people|Jay Suites - Bryant Park|Windowed Team office for up to 15|Team Office|15|10000|40.755|-73.987|2026-11-02
m/us/ny/new-york/jay-suites/team-office-3049-for-up-to-6|Jay Suites - Bryant Park|Team office #3049 for up to 6|Team Office|6|2500|40.755|-73.987|2026-11-02
m/us/ny/new-york/1501-broadway/private-office-96f6|Bevmax Office Centers - Times Square|Private office|Private Office|6|3500|40.757|-73.986|2026-11-02`,
};

/** Rows are url|venue|title|...fixed fields. Venue names can contain "|" (for example "Regus | LISBON"), so parse from the right. */
function parseRow(line: string, tail: number) {
  const p = line.split('|');
  const mid = p.slice(1, p.length - tail);
  return { url: p[0], venue: mid.slice(0, -1).join('|'), title: mid[mid.length - 1], t: p.slice(p.length - tail) };
}

const urlMember = (suffix: string) => `https://liquidspace.c${suffix}`;
const urlPool = (suffix: string) => `https://liquidspace.co${suffix}`;

/** Spaces in a city's real collection, with the recorded Pulse facts. */
export function collectionSpaces(city: string): AssessSpace[] {
  const key = city.toLowerCase().split(',')[0].trim();
  if (REAL_MEMBERS[key]) {
    return REAL_MEMBERS[key].split('\n').map((l, i) => {
      const { url, venue, title, t } = parseRow(l, key === 'lisbon' ? 8 : 7);
      const [lat, lng, modified, booking, type, desks, rate, minTerm] = t;
      return { id: `${key}-m${i}`, url: urlMember(url), venue, title, type, desks: +desks, rate: rate ? +rate : null, lat: +lat, lng: +lng, modified, booking, minTerm: minTerm || undefined, inCollection: true };
    });
  }
  const inv: Venue[] = SAMPLE_INVENTORY[key] ?? [];
  const meta = new Map(MEMBER_META.split('\n').map((l) => { const p = l.split('|'); return [urlMember(p[0]), p] as const; }));
  const out: AssessSpace[] = [];
  inv.forEach((v) => {
    const m = v.url ? meta.get(v.url) : undefined;
    if (!m || !v.url) return;
    out.push({ id: v.id, url: v.url, venue: v.operator, title: v.name, type: v.type, desks: v.desks, rate: v.monthlyPrice, lat: +m[1], lng: +m[2], modified: m[3], booking: m[4], responseMin: +m[5] || undefined, minTerm: v.minTerm, inCollection: true });
  });
  return out;
}

/** Nearby real listings that are not in the collection. */
export function marketPool(city: string): AssessSpace[] {
  const key = city.toLowerCase().split(',')[0].trim();
  const raw = POOL[key];
  if (!raw) return [];
  return raw.split('\n').map((l, i) => {
    const { url, venue, title, t } = parseRow(l, 6);
    const [type, desks, rate, lat, lng, modified] = t;
    return { id: `${key}-p${i}`, url: urlPool(url), venue, title, type, desks: +desks, rate: +rate, lat: +lat, lng: +lng, modified, inCollection: false };
  });
}

export const hasAssessmentData = (city: string) => collectionSpaces(city).length > 0;

const CITY_KEYS = Object.keys(CENTERS);
const norm = (u: string) => u.trim().replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase();

/** Find a recorded listing by its LiquidSpace link, in any recorded city. */
export function listingByUrl(url: string): { space: AssessSpace; city: string } | null {
  const n = norm(url);
  for (const city of CITY_KEYS) {
    const all = [...collectionSpaces(city), ...marketPool(city)];
    const hit = all.find((s) => norm(s.url) === n);
    if (hit) return { space: hit, city };
  }
  return null;
}

/** All recorded listings at a venue, given a venue link (one path level shorter than a space link). */
export function listingsAtVenue(venueUrl: string): AssessSpace[] {
  const n = norm(venueUrl) + '/';
  const out: AssessSpace[] = [];
  for (const city of CITY_KEYS) out.push(...[...collectionSpaces(city), ...marketPool(city)].filter((s) => norm(s.url).startsWith(n)));
  return out;
}

/** An example link to try in the demo: a real listing near the city center that is not yet in the collection. */
export const exampleLink = (city: string) => marketPool(city)[0]?.url ?? '';

/** The recorded city of a real LiquidSpace collection, from its link. Collections not recorded here return undefined. */
export function collectionCityFor(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const real = Object.entries(REAL_COLLECTIONS).find(([, c]) => c.url === url)?.[0];
  if (real) return real;
  return url.includes('573e59b5-7b3f-43cb-a0f1-e8d341902c4c') ? 'lisbon' : undefined;
}

/** Collections the Collection Agent built (populated from the requirement). Others were curated by hand or arrived another way. */
const AGENT_BUILT = [
  '43b4f500-e474-4b36-b303-9f875980c51e', 'a09a0bd0-054b-4da8-89f0-ef9816a8c2fa', 'c9004465-1786-4ecf-a5bf-199d72cb4e6a',
  '568ef221-1642-4822-b79f-3fe348062ccc', 'b6709b07-6512-4120-98b7-7a4dd7505bb4', '85361f6e-0113-4954-a782-54c933b5155c',
];
export const builtByAgent = (url: string | undefined) => !!url && AGENT_BUILT.some((id) => url.includes(id));

/** Per-venue facts recorded from Pulse (RatingsReviews, MonthlyInteractionLeads, RevenueRecognitionDedicated, Venues) on 2026-11-05. Key: listing path without the venue's last segment. Fields: stars|reviews|leads12|tours12|dedicatedSpaces|dedicatedMonths|lastDedicatedMonth|leadResponseMin|leadResponseRate|chain. Blank = no record. */
const VENUE_STATS = `pt/lisboa/lisboa/av-republic||||||||0|0|
pt/lisboa/lisboa/maleo-saldanha||||||||0|0|
pt/lisboa/lisboa/venture-x-portugal||||||||0|0|Venture X
pt/lisboa/lisbon/regus-lisbon-parque-das-na231245es||||||||0|0|IWG/Regus
pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade||||||||0|0|IWG/Regus
pt/lisbon/lisbon/spaces-lisbon-marques-de-pombal|5|1||||||0|0|IWG/Regus
pt/porto-district/porto/regus-porto-batalha||||||||0|0|IWG/Regus
pt/porto/matosinhos/spaces-matosinhos-spaces-matosinhos||||||||0|0|IWG/Regus
pt/porto/porto/regus-regus-porto-s-bento||||||||0|0|IWG/Regus
pt/porto/porto/vertical-coworking-dom-henrique||||||||0|0|
pt/porto/porto/work-wise-co-working-offices|||0|0||||0|0|
pt/porto/vila-nova-de-gaia/regus-gaia-arrabida||||||||0|0|IWG/Regus
us/co/denver/candy-factory-coworking|4.9|11|0|0|1|1|2023-04|0|0|
us/co/denver/industrious-denver|5|3|0|0||||0|0|Industrious
us/co/denver/industrious-lohi|5|1||||||0|0|Industrious
us/co/denver/regus-denver-place-denver-1|4|1|4|2||||119999|0|IWG/Regus
us/co/denver/serendipity-labs-denver-lodo|5|6|2|1|2|19|2025-09|28671|67|Serendipity Labs
us/co/denver/venture-x-denver-downtown-16th-street|4.9|19|1|0|1|1|2023-01|0|0|Venture X
us/co/denver/venture-x-lodo|4.9|14|1|1||||398|100|Venture X
us/il/chicago/expansive-river-north-superior|2.7|3|7|4|1|4|2026-11|428|100|Expansive
us/il/chicago/expansive-stetson-ave|||0|0|1|1|2024-09|0|0|Expansive
us/il/chicago/industrious-chicago-central-loop|5|1|2|0||||0|0|Industrious
us/il/chicago/industrious-millennium-park-chicago|||1|0||||0|0|Industrious
us/il/chicago/level-office|4.9|19|18|11|4|19|2026-11|16790|80|Expansive
us/il/chicago/level-office-211-w-wacker|4.5|13|0|0|1|14|2024-02|33314|67|Expansive
us/il/chicago/regus-111-w-jackson|5|2|1|0||||2320|0|IWG/Regus
us/il/chicago/regus-west-loop-200-s-wacker|||1|1||||0|0|IWG/Regus
us/il/chicago/workbox-the-loop|5|4|4|1||||0|0|Workbox
us/il/chicago/working-from|4.9|24|10|2|3|16|2026-11|33983|50|
us/mn/minneapolis/industrious-minneapolis-downtown|||0|0|1|1|2025-10|0|0|Industrious
us/mn/minneapolis/industrious-minneapolis-north-loop|5|3|0|0||||0|0|Industrious
us/mn/minneapolis/novel-coworking-minneapolis|5|1|2|2||||0|0|Expansive
us/mn/minneapolis/regus-minneapolis-lagoon-ave|||2|1|1|6|2026-11|0|0|IWG/Regus
us/mn/minneapolis/regus-minneapolis-washington-ave|||1|1||||0|0|IWG/Regus
us/mn/minneapolis/regus-minnesota-bloomington-normandale-lake|||0|0||||0|0|IWG/Regus
us/mn/minneapolis/regus-minnesota-center|||4|2||||8121|0|IWG/Regus
us/mn/minneapolis/regus-mn-minneapolis-south-6th-st||||||||0|0|IWG/Regus
us/mn/minneapolis/regus-spaces-north-loop|5|1|7|3|1|6|2026-11|82699|0|IWG/Regus
us/ny/new-york/1501-broadway|||0|0||||0|0|BevMax Office Centers
us/ny/new-york/53-beach-street|||7|5||||15|0|
us/ny/new-york/bevmax-office-centers-plaza-district|||0|0||||0|0|
us/ny/new-york/emerge212-1185-avenue-of-the-americas|4.6|25|3|2||||23238|50|Emerge212
us/ny/new-york/full-floor-penn-station-office|||8|3||||19610|50|
us/ny/new-york/industrious-indy-by-industrious-times-square||||||||0|0|Industrious
us/ny/new-york/jay-suites|4|5|9|4||||790|67|Jay Suites
us/ny/new-york/jay-suites-38th-street-new-york|4.5|10|4|0|1|1|2024-08|16|100|Jay Suites
us/ny/new-york/jay-suites-chelsea|4.3|11|1|0|1|1|2023-12|169|50|Jay Suites
us/ny/new-york/regus-americas-tower|4|1|5|1|1|3|2026-11|84917|0|IWG/Regus
us/ny/new-york/select-office-suites-flatiron|4.4|64|29|15|2|4|2023-04|11711|91|Select Office Suites
us/ny/new-york/tower-49-by-industrious|5|1|6|1||||17541|0|Industrious
us/ny/new-york/workville|4.5|31|13|10|2|3|2025-12|37597|33|IHG Meetings
us/tx/austin/dwell-coworking-downtown|4|2||||||0|0|
us/tx/austin/expansive-austin-highland|4|12|2|1|2|14|2026-11|351|100|Expansive
us/tx/austin/industrious-austin|3.5|2|2|2|1|5|2023-06|0|0|Industrious
us/tx/austin/indy-by-industrious||||||||0|0|Industrious
us/tx/austin/novel-coworking-north-austin|4.8|9|6|5|3|26|2026-11|1181|100|Expansive
us/tx/austin/regus-aspen-lake-one|5|1|0|0||||0|0|IWG/Regus
us/tx/austin/regus-dobie-center|5|2|3|2||||8582|0|IWG/Regus
us/tx/austin/regus-river-place|||2|1|1|7|2026-11|0|0|IWG/Regus
us/tx/austin/regus-westlake|||4|1||||0|0|IWG/Regus
us/tx/dallas/1910-pacific-place|||19|7|5|43|2026-11|1048|100|Boxer Property
us/tx/dallas/4100-spring-valley-rd|||6|1|4|34|2026-05|6827|100|Boxer Property
us/tx/dallas/8330-lbj-freeway|||6|1|2|13|2024-11|8180|100|Boxer Property
us/tx/dallas/boxer-14800-quorum|||2|2|1|9|2023-09|3025|100|Boxer Property
us/tx/dallas/boxer-northbrook-atrium-plaza|||5|0|2|16|2025-06|0|0|Boxer Property
us/tx/dallas/boxer-office-alpha|||6|4|1|12|2024-05|5354|75|Boxer Property
us/tx/dallas/carillon-towers|||21|8|1|12|2024-10|8182|100|Boxer Property
us/tx/dallas/level-office-701commerce|4.8|6|6|2|3|10|2026-11|0|0|Expansive`;

export interface VenueStats { stars?: number; reviews?: number; leads12?: number; tours12?: number; dedicatedSpaces?: number; dedicatedMonths?: number; lastDedicated?: string; responseMin?: number; responseRate?: number; chain?: string }
const STATS = new Map<string, VenueStats>(VENUE_STATS.split('\n').map((l) => {
  const p = l.split('|'); const n = (i: number) => (p[i] === '' || p[i] === undefined ? undefined : +p[i]);
  return [p[0], { stars: n(1), reviews: n(2), leads12: n(3), tours12: n(4), dedicatedSpaces: n(5), dedicatedMonths: n(6), lastDedicated: p[7] || undefined, responseMin: n(8) || undefined, responseRate: n(9) || undefined, chain: p[10] || undefined }] as const;
}));
/** Facts about the venue that holds a listing, or null when none are recorded. */
export function venueStats(url: string): VenueStats | null {
  const path = url.replace(/^https?:\/\/liquidspace\.com\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
  return STATS.get(path.split('/').slice(0, -1).join('/')) ?? null;
}
/** Venue key: the listing path without its last segment. */
export const venueKey = (url: string) => url.replace(/^https?:\/\/liquidspace\.com\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').slice(0, -1).join('/');

/** Each space's amenities recorded from Pulse (Workspaces.Amenities) on 2026-11-05: path|how many|first three. Blank when the listing has none recorded. */
const AMENITIES = `us/mn/minneapolis/industrious-minneapolis-north-loop/minlop002suite|10|24/7 Access, Door w/Lock, Furnished
pt/porto/porto/work-wise-co-working-offices/office-1|10|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/53-beach-street/office-suite-1|10|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/jay-suites-38th-street-new-york/private-office-suite-12-floor|10|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/jay-suites-chelsea/suite-802-abc|9|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/av-republic/office-17-6-person-office-copy|8|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/select-office-suites-flatiron/40-person-windowed-team-room|8|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/venture-x-portugal/office-18-copy|9|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/venture-x-portugal/office-4|8|24/7 Access, Door w/Lock, Furnished
us/tx/austin/dwell-coworking-downtown/office-suite-3|8|24/7 Access, Door w/Lock, Furnished
us/il/chicago/expansive-stetson-ave/team-suite-3300a-copy-1041|8|24/7 Access, Door w/Lock, Furnished
us/il/chicago/level-office-211-w-wacker/office-suite-1500a-copy-6189|8|24/7 Access, Door w/Lock, Furnished
us/co/denver/candy-factory-coworking/office-for-6-copy|6|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/venture-x-portugal/office-2|6|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/maleo-saldanha/office-suite-1|7|24/7 Access, Door w/Lock, Furnished
us/co/denver/candy-factory-coworking/private-office-for-8-10-people|7|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/av-republic/office-1|7|24/7 Access, Door w/Lock, Furnished
us/tx/austin/novel-coworking-north-austin/club-suite-200c-copy|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/club-suite-107-copy-95d1|6|24/7 Access, Door w/Lock, Furnished
us/tx/austin/expansive-austin-highland/club-suite-200e-copy|6|24/7 Access, Door w/Lock, Furnished
us/tx/dallas/level-office-701commerce/club-suite-200b-copy-2e9c|6|24/7 Access, Door w/Lock, Furnished
us/il/chicago/expansive-river-north-superior/office-suite-100b-copy-37c1|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-7|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600b-copy-9c5a|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-500h-copy|6|24/7 Access, Door w/Lock, Furnished
us/il/chicago/level-office/office-suite-1300c-copy|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600c-copy|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600d-copy|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600e-copy-2|6|24/7 Access, Door w/Lock, Furnished
us/mn/minneapolis/novel-coworking-minneapolis/office-suite-500b-copy|6|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/workville/team-office-18-person-capacity-copy-copy|7|24/7 Access, Door w/Lock, Furnished
us/il/chicago/working-from/private-studio-411|7|24/7 Access, Door w/Lock, Furnished
us/ny/new-york/1501-broadway/private-office-96f6|5|24/7 Access, Door w/Lock, Furnished
pt/porto/porto/vertical-coworking-dom-henrique/office-1|6|24/7 Access, Door w/Lock, Furnished
pt/porto/porto/vertical-coworking-dom-henrique/office-3|6|24/7 Access, Door w/Lock, Furnished
pt/porto/porto/vertical-coworking-dom-henrique/office-2|6|24/7 Access, Door w/Lock, Furnished
pt/lisboa/lisboa/venture-x-portugal/office-3|5|24/7 Access, Door w/Lock, Meeting Rooms
us/tx/austin/industrious-austin/ausdtn016|6|24/7 Access, Furnished, Mailbox Services
us/tx/austin/industrious-austin/ausdtn024|6|24/7 Access, Furnished, Mailbox Services
us/tx/austin/industrious-austin/ausdtn128|6|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-chicago-central-loop/chisla023|6|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-chicago-central-loop/chisla045|6|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-chicago-central-loop/chisla085|6|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-chicago-central-loop/chisla093|6|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-chicago-central-loop/chisla094|6|24/7 Access, Furnished, Mailbox Services
us/co/denver/serendipity-labs-denver-lodo/5-person-office|6|24/7 Access, Furnished, Mailbox Services
us/co/denver/serendipity-labs-denver-lodo/8-person-office|6|24/7 Access, Furnished, Mailbox Services
us/co/denver/serendipity-labs-denver-lodo/10-person-office|6|24/7 Access, Furnished, Mailbox Services
us/co/denver/serendipity-labs-denver-lodo/20-person-offices|6|24/7 Access, Furnished, Mailbox Services
us/co/denver/venture-x-lodo/dedicated-desk-1|5|24/7 Access, Furnished, Mailbox Services
us/tx/austin/indy-by-industrious/ausbur220|5|24/7 Access, Furnished, Mailbox Services
us/il/chicago/industrious-millennium-park-chicago/chi24e116|5|24/7 Access, Furnished, Mailbox Services
us/co/denver/venture-x-denver-downtown-16th-street/dedicated-desk-1|5|24/7 Access, Furnished, Meeting Rooms
us/tx/dallas/1910-pacific-place/suite-2090-8537|2|24/7 Access, WiFi
us/tx/dallas/4100-spring-valley-rd/suite-100ws|2|24/7 Access, WiFi
us/tx/dallas/1910-pacific-place/suite-11400|2|24/7 Access, WiFi
us/tx/dallas/1910-pacific-place/suite-18100|2|24/7 Access, WiFi
us/tx/dallas/boxer-14800-quorum/suite-200|2|24/7 Access, WiFi
us/tx/dallas/8330-lbj-freeway/suite-b725ws|2|24/7 Access, WiFi
us/tx/dallas/1910-pacific-place/suite-14250-cffe|2|24/7 Access, WiFi
pt/lisboa/lisbon/regus-lisbon-parque-das-na231245es/private-office-05f8|4|Door w/Lock, Furnished, Phone
pt/porto/porto/regus-regus-porto-s-bento/team-office-5bdc|4|Door w/Lock, Furnished, Phone
us/co/denver/regus-denver-place-denver-1/team-office-4ce7|4|Door w/Lock, Furnished, Phone
pt/porto-district/porto/regus-porto-batalha/team-office-6505|4|Door w/Lock, Furnished, Phone
us/ny/new-york/regus-americas-tower/team-office-d03a|4|Door w/Lock, Furnished, Phone
pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade/team-office-d10a|4|Door w/Lock, Furnished, Phone
pt/porto/matosinhos/spaces-matosinhos-spaces-matosinhos/team-office-b8f0|4|Door w/Lock, Furnished, Phone
us/il/chicago/regus-111-w-jackson/team-office-fdd4|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office-db31|4|Door w/Lock, Furnished, Phone
us/il/chicago/regus-111-w-jackson/private-office-1d56|4|Door w/Lock, Furnished, Phone
pt/lisbon/lisbon/spaces-lisbon-marques-de-pombal/private-office-fe67|4|Door w/Lock, Furnished, Phone
pt/lisbon/lisbon/regus-lisbon-avenida-da-liberdade/private-office-bcb8|4|Door w/Lock, Furnished, Phone
pt/porto/vila-nova-de-gaia/regus-gaia-arrabida/team-office|4|Door w/Lock, Furnished, Phone
us/il/chicago/regus-111-w-jackson/team-office-9d23|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office|4|Door w/Lock, Furnished, Phone
pt/lisbon/lisbon/spaces-lisbon-marques-de-pombal/team-office|4|Door w/Lock, Furnished, Phone
us/ny/new-york/regus-americas-tower/team-office-2f1f|4|Door w/Lock, Furnished, Phone
us/il/chicago/regus-west-loop-200-s-wacker/team-office-2c31|4|Door w/Lock, Furnished, Phone
pt/porto-district/porto/regus-porto-batalha/team-office-0582|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-minnesota-bloomington-normandale-lake/team-office-1370|4|Door w/Lock, Furnished, Phone
us/tx/austin/regus-westlake/team-office-3168|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-minnesota-center/team-office-6896|4|Door w/Lock, Furnished, Phone
us/tx/austin/regus-river-place/team-office-7a45|4|Door w/Lock, Furnished, Phone
us/tx/austin/regus-dobie-center/team-office-ccd8|4|Door w/Lock, Furnished, Phone
us/ny/new-york/regus-americas-tower/team-office-c7b9|4|Door w/Lock, Furnished, Phone
us/tx/austin/regus-aspen-lake-one/team-office-df64|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-spaces-north-loop/team-office-d119|4|Door w/Lock, Furnished, Phone
pt/porto/matosinhos/spaces-matosinhos-spaces-matosinhos/team-office-dafb|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office-b8bb|4|Door w/Lock, Furnished, Phone
pt/porto/porto/regus-regus-porto-s-bento/team-office-ee24|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-minneapolis-lagoon-ave/team-office-1bd5|4|Door w/Lock, Furnished, Phone
us/mn/minneapolis/regus-minneapolis-washington-ave/team-office-c8ad|4|Door w/Lock, Furnished, Phone
pt/porto/vila-nova-de-gaia/regus-gaia-arrabida/team-office-de19|4|Door w/Lock, Furnished, Phone
us/tx/dallas/boxer-northbrook-atrium-plaza/suite-1310|2|Furnished, WiFi
us/ny/new-york/emerge212-1185-avenue-of-the-americas/team-room-311-with-interior-call-room|2|Furnished, WiFi
us/ny/new-york/emerge212-1185-avenue-of-the-americas/team-room-219|2|Furnished, WiFi
us/ny/new-york/bevmax-office-centers-plaza-district/suite-39|2|Furnished, WiFi
us/il/chicago/workbox-the-loop/office-1-6146|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-6050|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-5045|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-9050|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-9350|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-12030|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-10500|2|Furnished, WiFi
us/tx/dallas/1910-pacific-place/suite-15400|2|Furnished, WiFi
us/ny/new-york/jay-suites/windowed-team-office-for-up-to-15-people|2|Furnished, WiFi
us/ny/new-york/jay-suites/team-office-3049-for-up-to-6|2|Furnished, WiFi`;
const AMEN = new Map<string, { n: number; top: string }>(AMENITIES.split('\n').map((l) => { const p = l.split('|'); return [p[0], { n: +p[1], top: p[2] }] as const; }));
export function amenitiesFor(url: string): { n: number; top: string } | null {
  return AMEN.get(url.replace(/^https?:\/\/liquidspace\.com\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '')) ?? null;
}
