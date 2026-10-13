const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.querySelector('.primary-navigation');
const navigationLinks = [...document.querySelectorAll('.primary-navigation a')];

function setMenuOpen(isOpen) {
  if (!menuToggle || !primaryNavigation) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  primaryNavigation.classList.toggle('is-open', isOpen);
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navigationLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNavigation.classList.contains('is-open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (primaryNavigation.classList.contains('is-open') && !primaryNavigation.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
}

const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (!visibleSections.length) return;

    const activeEntry = visibleSections.reduce((closest, entry) => (
      Math.abs(entry.boundingClientRect.top) < Math.abs(closest.boundingClientRect.top) ? entry : closest
    ));

    navigationLinks.forEach((link) => {
      if (link.hash === `#${activeEntry.target.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });

  observedSections.forEach((section) => activeSectionObserver.observe(section));
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const answerId = button.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;
    if (!answer) return;

    button.setAttribute('aria-expanded', String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const languageNames = { en: 'English', 'zh-hant': '繁體中文', 'zh-hans': '简体中文' };
const languageStorageKey = 'eduhk-lacrosse-language';
const languageQueryKey = 'lang';

const traditionalChinese = {
  'FIELD NOTES / 01': '球場紀錄 / 01', 'OUR LACROSSE COMMUNITY': '我們的棍網球社群', 'Learning, playing': '一起學習、參與', 'and growing together.': '共同成長。', 'TOGETHER ON THE FIELD': '球場上的我們', 'One team. Many stories.': '一支球隊，無數故事。', 'TEAM CULTURE': '團隊文化', 'Rise together.': '一起進步。', 'GAME DAY': '比賽日', 'Earned together.': '共同努力的成果。',
  'EdUHK lacrosse team posing together on the field after a competition': 'EdUHK棍網球隊在比賽後於球場上合照。', 'Lacrosse players huddle together before a game': '棍網球球員在比賽前圍圈打氣。', 'EdUHK lacrosse players gathering for a team talk on the field': 'EdUHK棍網球球員在球場上聚集交流戰術。',
  'Skip to content': '跳至主要內容', 'EdUHK LACROSSE': 'EdUHK 棍網球', 'INTEREST GROUP': '興趣小組',
  'Home': '首頁', 'About': '關於我們', 'Our Goal': '我們的目標', 'Training': '訓練', 'Activities': '活動', 'Join Us': '加入我們', 'Contact': '聯絡我們',
  'Main navigation': '主要導覽', 'Choose language': '選擇語言', 'Open navigation': '開啟導覽選單', 'Close navigation': '關閉導覽選單', 'Menu': '選單',
  'Student-led · Open to all levels': '學生主導 · 歡迎不同程度的學生', 'THE EDUCATION UNIVERSITY OF HONG KONG': '香港教育大學',
  'Let’s build': '一起建立', 'EdUHK lacrosse': 'EdUHK 棍網球', 'together.': '隊！',
  'We are a group of passionate EdUHK students working towards forming a lacrosse sports team during the 2026–27 academic year.': '我們是一群熱愛棍網球的教大學生，正努力於2026–27學年組建一支棍網球運動隊。',
  'We currently have 7 committed players and are aiming to grow to 18 committed players starting from October 2026.': '我們目前有7名已承諾參與的球員，目標是由2026年10月起增至18名。',
  'Join the Interest Group': '加入興趣小組', 'View Training Times': '查看訓練時間', '7 committed players': '7名已承諾參與的球員', 'Target: 18': '目標：18名', 'SCROLL TO EXPLORE': '向下瀏覽',
  '01 / ABOUT': '01 / 關於我們', 'A new student community': '全新的學生社群', 'Who we are': '關於我們',
  'We are a group of passionate students at The Education University of Hong Kong who are interested in lacrosse, physical activity, teamwork, and student-led sport.': '我們是一群來自香港教育大學、熱愛棍網球、體育活動、團隊合作及學生主導運動的學生。',
  'Some of us have previous playing experience, while others are discovering lacrosse for the first time. We are building a welcoming community where students can learn the sport, develop their skills, stay active, and connect with others.': '有些成員曾接觸棍網球，亦有成員是第一次認識這項運動。我們正建立一個友善、具支持性的社群，讓學生學習棍網球、提升技術、保持活躍，並與其他同學建立聯繫。',
  'Our longer-term aim is to establish an EdUHK lacrosse sports team during the 2026–27 academic year.': '我們的長遠目標是在2026–27學年組建一支EdUHK棍網球運動隊。',
  'START HERE': '由此開始', 'Learn': '學習', 'Develop fundamental lacrosse skills, game understanding, movement ability, and confidence.': '學習棍網球基本技巧、比賽理解、身體活動能力，並建立自信。',
  'GET MOVING': '投入活動', 'Play': '參與', 'Take part in regular practices, small-sided games, friendly activities, and future inter-university opportunities.': '參與定期訓練、小型比賽及友誼活動，並探索未來校際交流機會。',
  'GROW TOGETHER': '共同成長', 'Build': '共建', 'Help grow a committed student community and work together towards forming an EdUHK lacrosse team.': '共同建立投入的學生社群，攜手朝組建EdUHK棍網球隊的目標邁進。',
  '02 / OUR GOAL': '02 / 我們的目標', 'The journey to 2026–27': '邁向2026–27學年', 'Help us': '協助我們', 'build the': '建立', 'team.': '球隊。',
  'We are currently building the foundation of the group. Every committed player brings us closer to forming an EdUHK lacrosse sports team in the 2026–27 academic year.': '我們目前正逐步建立小組的基礎。每一位已承諾參與的球員，都會令我們更接近在2026–27學年組建EdUHK棍網球運動隊的目標。',
  'Growing from October 2026': '由2026年10月起招募', 'PLAYER PROGRESS': '球員進度', '01 / 01': '01 / 01', 'of': '/', 'committed players': '名已承諾參與的球員', '7 committed': '7名已加入', '11 to go': '尚需11名',
  'Help us turn a shared interest into a team.': '與我們一起將共同興趣發展成一支球隊。', 'Become One of the 18': '成為18名球員之一', 'Current committed players': '目前已承諾參與的球員', 'Target number of committed players': '目標球員人數', 'Academic year goal': '目標學年',
  'A note from our student organisers': '學生籌備小組的話', 'A place to learn': '一起學習', 'and': '並', 'belong.': '找到歸屬。',
  'The EdUHK Lacrosse Interest Group is a student-led community built around participation, development, and connection. Whether you are picking up a stick for the first time or already have lacrosse experience, you are welcome to join us. Together, we hope to create an active and supportive environment and build towards representing EdUHK as a lacrosse team.': '教大棍網球興趣小組是一個以參與、成長和交流為核心的學生主導社群。無論你是第一次拿起球棍，還是已有棍網球經驗，我們都歡迎你加入。讓我們一起營造積極互助的環境，並朝著組建代表EdUHK的棍網球隊邁進。',
  '“Seven players have started the journey. Help us reach eighteen.”': '「七位球員已踏上旅程，邀請你與我們一起達成十八人的目標。」', 'MESSAGE FROM THE STUDENT ORGANISING GROUP': '學生籌備小組寄語',
  '03 / TRAINING': '03 / 訓練', 'Meet us on the field': '球場上見', 'Regular training': '定期', 'sessions': '訓練課節',
  'We currently organise regular training sessions for students who want to learn, practise, and develop their lacrosse skills. Please contact us before attending because schedules, venues, equipment arrangements, and session details may change.': '我們現正為希望學習、練習及提升棍網球技術的學生安排定期訓練課節。出席前請先聯絡我們，因時間、場地、器材安排及課節詳情或會有所調整。',
  'MONDAY': '星期一', 'Block E Artificial Turf': 'E座人造草地', 'EdUHK campus': '香港教育大學校園', 'ARRIVAL / 18:20': '集合時間 / 18:20',
  'Please gather 10 minutes earlier at the Block E Sports Complex Lower Platform, LP Floor, to collect equipment before moving to the artificial turf.': '請提前10分鐘在E座體育綜合大樓地下平台 LP層集合，領取器材後前往人造草地。',
  'Fundamental skills, passing, catching, movement, shooting, team concepts, and small-sided games.': '練習基本技巧、傳球、接球、移動、射門、團隊概念及小型比賽。',
  'THURSDAY': '星期四', 'ARRIVAL / 10:20': '集合時間 / 10:20', 'Skills development, game understanding, fitness, positional practice, and match-based activities.': '提升技巧和比賽理解，並進行體能、位置練習及模擬比賽活動。',
  'Plan to join us?': '準備好加入嗎？', 'Training times and arrangements may be adjusted depending on campus facilities, weather, academic commitments, equipment availability, and group needs. Contact us before attending your first session.': '訓練時間及安排或會因校園設施、天氣、學業安排、器材供應及小組需要而調整。首次出席前請先聯絡我們。', 'Ask About Training': '查詢訓練安排',
  'ALL EXPERIENCE LEVELS': '歡迎不同經驗程度', 'Curious about a new sport?': '想試試新運動？', 'New to': '初次接觸', 'lacrosse': '棍網球', '?': '？',
  'No previous lacrosse experience is required. We welcome students who are curious about trying a new sport, as well as students who have played lacrosse before. Sessions will introduce the basic rules, equipment, movement patterns, and core skills step by step.': '無須具備棍網球經驗。我們歡迎想嘗試新運動的學生，也歡迎曾接觸棍網球的同學。訓練課節會循序漸進地介紹基本規則、器材、移動方式及核心技巧。',
  'I’m New to Lacrosse': '我是棍網球新手', 'I Have Playing Experience': '我有棍網球經驗', 'Contact us': '聯絡我們', 'Send a message or complete the interest form.': '傳送訊息或填寫興趣登記表。', 'Attend a session': '參加訓練課節', 'Meet the group and take part at your own pace.': '認識小組成員，按自己的步伐參與。', 'Learn and commit': '持續學習與投入', 'Develop your skills and help us work towards forming the team.': '提升技術，協助我們朝組建球隊的目標邁進。',
  '04 / ACTIVITIES': '04 / 活動', 'A little bit of everything': '多元活動體驗', 'What we do': '我們的活動',
  'BEGINNER': '新手友善', 'Beginner Lacrosse Sessions': '棍網球入門課節', 'Start with the basics in a supportive setting. No experience needed—just bring your curiosity.': '在互相支持的環境中由基本技巧開始。無須經驗，只要帶著好奇心來參加。',
  'SKILLS': '技巧訓練', 'Stick Skills and Passing': '球棍技巧與傳球', 'Build control and confidence through progressive catching, cradling, and passing drills.': '透過循序漸進的接球、持球及傳球練習，提升控球能力與自信。',
  'ALL LEVELS': '適合各程度', 'Small-Sided Games': '小型比賽', 'Learn by playing, practise decisions, and enjoy friendly game scenarios at every level.': '從比賽中學習、練習判斷，並享受適合不同程度的友善賽事。',
  'Shooting and Finishing': '射門與完成進攻', 'Explore accuracy, technique, and creative ways to finish around goal.': '探索射門準確度、技巧，以及在球門附近完成進攻的方法。',
  'FITNESS': '體能訓練', 'Speed, Agility, and Fitness': '速度、敏捷與體能', 'Develop movement, coordination, and match-ready fitness through varied activities.': '透過多元活動提升移動能力、協調性及比賽所需體能。',
  'COMMUNITY': '社群交流', 'Team-Building Activities': '團隊建立活動', 'Get to know one another, build trust, and shape the student community together.': '互相認識、建立信任，並共同塑造學生社群。',
  '05 / COMMUNITY': '05 / 社群', 'The way we play and grow': '共同參與與成長', 'What we': '我們重視', 'value.': '的價值。', 'There is room in our group for different starting points, strengths, and ambitions. We want everyone to feel welcome and able to contribute.': '小組歡迎不同起點、長處與目標的同學。我們希望每位成員都感到受歡迎，並能作出貢獻。',
  'Commitment': '投入', 'Show up, stay curious, and help the group move forward.': '持續參與、保持好奇，並協助小組前進。', 'Inclusion': '共融', 'Make space for every student, skill level, and background.': '接納不同學生、技術程度與背景。', 'Teamwork': '團隊合作', 'Support one another on the field and beyond it.': '在球場內外互相支持。', 'Respect': '尊重', 'Play with care, listen well, and value the people around us.': '用心參與、用心聆聽，並珍視身邊的人。', 'Growth': '成長', 'Learn from practice, challenges, and each other.': '從訓練、挑戰及彼此交流中學習。', 'Wellbeing': '身心健康', 'Enjoy movement and build healthy habits together.': '享受運動，一起建立健康習慣。',
  'YOU’RE WELCOME IF YOU’RE A…': '我們歡迎你加入，如果你是……', 'Complete beginner': '棍網球初學者', 'Experienced player': '有經驗的球員', 'Student from any programme': '任何課程的學生', 'Future coach or sports leader': '有志成為教練或體育領袖的學生', 'Student who wants to stay active': '希望保持活躍的學生', 'Community builder': '希望建立新社群的學生',
  '06 / JOIN US': '06 / 加入我們', 'Your next move starts here': '你的下一步由此開始', 'Join the first': '加入首個', 'team-building': '球隊共建', 'journey.': '旅程。',
  'We are looking for students who are interested in lacrosse and willing to contribute to the development of the group. You do not need to be an expert, but regular participation, enthusiasm, teamwork, and commitment will help us move towards our goal of forming an EdUHK lacrosse sports team during the 2026–27 academic year.': '我們希望邀請對棍網球有興趣並願意為小組發展作出貢獻的學生加入。你無須是專家；定期參與、熱誠、團隊合作和投入，將幫助我們朝著在2026–27學年組建EdUHK棍網球運動隊的目標邁進。',
  'CURRENT GROUP': '目前小組人數', '7 committed players': '7名已承諾參與的球員', 'WE HOPE TO REACH': '我們希望達到', '18 committed players': '18名已承諾參與的球員', 'starting from October 2026': '由2026年10月起', 'TAKE PART IN WHAT’S NEXT': '參與接下來的旅程', 'Come build': '一起建立', 'with us.': '我們的球隊。', 'Say hello, ask about training, or tell us what you’re interested in.': '歡迎打聲招呼、查詢訓練，或告訴我們你感興趣的內容。', 'PHONE / WHATSAPP': '電話 / WhatsApp', 'EMAIL': '電郵', 'Join the Group': '加入小組', 'Contact Us on WhatsApp': '透過WhatsApp聯絡我們',
  '07 / GOOD TO KNOW': '07 / 常見問題', 'Questions, answered': '解答你的疑問', 'Frequently asked': '常見', 'questions': '問題',
  'Do I need previous lacrosse experience?': '我需要有棍網球經驗嗎？', 'No. Beginners are welcome, and we will introduce basic skills, rules, equipment, and game activities step by step.': '不需要。我們歡迎初學者，並會循序漸進地介紹基本技巧、規則、器材及比賽活動。',
  'Do I need to own a lacrosse stick?': '我需要自備球棍嗎？', 'Not necessarily. Contact the organising group before attending so we can explain current equipment arrangements and availability. If you are browsing options, the': '不一定。出席前請先聯絡籌備小組，了解現時器材安排及供應情況。如你正在了解球棍選擇，', 'Nike Surge LT lacrosse stick': 'Nike Surge LT棍網球球棍', 'is one example—please check sizing and suitability with us before purchasing.': '是其中一個例子；購買前請先向我們確認尺寸及是否合適。',
  'Where should I go before training?': '訓練前應到哪裏集合？', 'Gather at the Block E Sports Complex Lower Platform, LP Floor. We will collect equipment before going to the Block E Artificial Turf.': '請在E座體育綜合大樓地下平台 LP層集合。領取器材後，我們會前往E座人造草地。',
  'What should I wear?': '應穿著甚麼？', 'Wear comfortable sports clothing and suitable athletic shoes. Bring water and any personal sports equipment you already have.': '請穿著舒適的運動服及合適的運動鞋，並帶備飲用水和已有的個人運動器材。',
  'Can students from any programme join?': '任何課程的學生都可以加入嗎？', 'Yes. The group welcomes students from different programmes who are interested in learning, participating, and helping to build the community.': '可以。小組歡迎不同課程、對學習、參與及建立社群有興趣的學生加入。',
  'Is this already an official EdUHK team?': '這已是EdUHK官方球隊嗎？', 'We are currently a student-led lacrosse interest group working towards forming a sports team during the 2026–27 academic year. Official team status and future competitions will depend on the relevant approval and development process.': '我們目前是學生主導的棍網球興趣小組，正努力於2026–27學年組建運動隊。官方球隊資格及未來比賽安排須視乎相關審批及發展程序。',
  'How can I become one of the committed players?': '如何成為已承諾參與的球員之一？', 'Contact us by WhatsApp or email, attend training regularly, and speak with the organising group about your interest and availability.': '請透過WhatsApp或電郵聯絡我們，定期參加訓練，並與籌備小組談談你的興趣及時間安排。',
  '08 / CONTACT': '08 / 聯絡我們', 'Your place on the field is waiting': '球場上有你的位置', 'Ready to pick': '準備好拿起', 'up a': '一支', 'stick?': '球棍了嗎？',
  'Interested in trying lacrosse, returning to the sport, or helping us build the first EdUHK lacrosse team? Contact us and join the journey.': '想嘗試棍網球、重拾這項運動，或協助我們建立首支EdUHK棍網球隊？歡迎聯絡我們，一起踏上這段旅程。',
  'TRAINING': '訓練時間', 'Monday 18:30–20:30': '星期一 18:30–20:30', 'Thursday 10:30–12:30': '星期四 10:30–12:30', 'VENUE / ARRIVAL': '場地 / 集合地點', 'Gather at Block E Sports Complex Lower Platform, LP Floor, to collect equipment.': '請在E座體育綜合大樓地下平台 LP層集合領取器材。', 'Send an Email': '傳送電郵', 'Message on WhatsApp': '透過WhatsApp傳訊', 'Learn together. Play together. Build the team together.': '一起學習，一起參與，一起建立球隊。',
  'The Education University of Hong Kong': '香港教育大學', 'A student-led community working towards forming a lacrosse sports team during the 2026–27 academic year.': '學生主導的社群，正努力於2026–27學年組建棍網球運動隊。', 'Learn · Play · Build': '學習 · 參與 · 共建', 'EdUHK Lacrosse Interest Group': '教大棍網球興趣小組', 'This website represents a student-led interest group. It is not an official university website unless separately approved by The Education University of Hong Kong.': '本網站代表一個學生主導的興趣小組。除非另獲香港教育大學批准，否則本網站並非大學官方網站。',
  'Footer navigation': '頁尾導覽', 'Student organising group': '學生籌備小組', 'Field lacrosse stick angled upward, with a narrow throat, flared triangular head, netted pocket, and ball': '向右上方傾斜的棍網球球棍，具有窄喉部、外展三角形球頭、網袋及球。',
  'Committed players towards the target of 18': '朝18名球員目標邁進的已承諾參與球員人數', '7 of 18 committed players': '18名目標中的7名已承諾參與球員',
  'EdUHK Lacrosse Emblemcrest showing the green-and-orange lacrosse crest': 'EdUHK棍網球徽章，呈現綠橙色球棍圖案。'
};

const simplifiedChinese = {
  'FIELD NOTES / 01': '球场记录 / 01', 'OUR LACROSSE COMMUNITY': '我们的棍网球社群', 'Learning, playing': '一起学习、参与', 'and growing together.': '共同成长。', 'TOGETHER ON THE FIELD': '球场上的我们', 'One team. Many stories.': '一支球队，无数故事。', 'TEAM CULTURE': '团队文化', 'Rise together.': '一起进步。', 'GAME DAY': '比赛日', 'Earned together.': '共同努力的成果。',
  'EdUHK lacrosse team posing together on the field after a competition': 'EdUHK棍网球队在比赛后于球场上合影。', 'Lacrosse players huddle together before a game': '棍网球球员在比赛前围圈鼓劲。', 'EdUHK lacrosse players gathering for a team talk on the field': 'EdUHK棍网球球员在球场上聚集交流战术。',
  'Skip to content': '跳至主要内容', 'EdUHK LACROSSE': 'EdUHK 棍网球', 'INTEREST GROUP': '兴趣小组',
  'Home': '首页', 'About': '关于我们', 'Our Goal': '我们的目标', 'Training': '训练', 'Activities': '活动', 'Join Us': '加入我们', 'Contact': '联系我们',
  'Main navigation': '主导航', 'Choose language': '选择语言', 'Open navigation': '打开导航菜单', 'Close navigation': '关闭导航菜单', 'Menu': '菜单',
  'Student-led · Open to all levels': '学生主导 · 欢迎不同程度的学生', 'THE EDUCATION UNIVERSITY OF HONG KONG': '香港教育大学',
  'Let’s build': '一起建设', 'EdUHK lacrosse': 'EdUHK 棍网球', 'together.': '队！',
  'We are a group of passionate EdUHK students working towards forming a lacrosse sports team during the 2026–27 academic year.': '我们是一群热爱棍网球的教大学生，正努力于2026–27学年组建一支棍网球运动队。',
  'We currently have 7 committed players and are aiming to grow to 18 committed players starting from October 2026.': '我们目前有7名已承诺参与的球员，目标是从2026年10月起增至18名。',
  'Join the Interest Group': '加入兴趣小组', 'View Training Times': '查看训练时间', '7 committed players': '7名已承诺参与的球员', 'Target: 18': '目标：18名', 'SCROLL TO EXPLORE': '向下浏览',
  '01 / ABOUT': '01 / 关于我们', 'A new student community': '全新的学生社群', 'Who we are': '关于我们',
  'We are a group of passionate students at The Education University of Hong Kong who are interested in lacrosse, physical activity, teamwork, and student-led sport.': '我们是一群来自香港教育大学、热爱棍网球、体育活动、团队合作及学生主导运动的学生。',
  'Some of us have previous playing experience, while others are discovering lacrosse for the first time. We are building a welcoming community where students can learn the sport, develop their skills, stay active, and connect with others.': '有些成员曾接触棍网球，也有成员是第一次认识这项运动。我们正建设一个友善、互相支持的社群，让学生学习棍网球、提升技术、保持活跃，并与其他同学建立联系。',
  'Our longer-term aim is to establish an EdUHK lacrosse sports team during the 2026–27 academic year.': '我们的长远目标是在2026–27学年组建一支代表EdUHK的棍网球运动队。',
  'START HERE': '从这里开始', 'Learn': '学习', 'Develop fundamental lacrosse skills, game understanding, movement ability, and confidence.': '学习棍网球基本技巧、比赛理解、身体活动能力，并建立自信。',
  'GET MOVING': '投入活动', 'Play': '参与', 'Take part in regular practices, small-sided games, friendly activities, and future inter-university opportunities.': '参加定期训练、小型比赛和友谊活动，并探索未来校际交流机会。',
  'GROW TOGETHER': '共同成长', 'Build': '共建', 'Help grow a committed student community and work together towards forming an EdUHK lacrosse team.': '共同建设投入的学生社群，携手朝组建EdUHK棍网球运动队的目标迈进。',
  '02 / OUR GOAL': '02 / 我们的目标', 'The journey to 2026–27': '迈向2026–27学年', 'Help us': '帮助我们', 'build the': '建设', 'team.': '球队。',
  'We are currently building the foundation of the group. Every committed player brings us closer to forming an EdUHK lacrosse sports team in the 2026–27 academic year.': '我们目前正逐步建立小组基础。每一位已承诺参与的球员，都让我们更接近在2026–27学年组建EdUHK棍网球运动队的目标。',
  'Growing from October 2026': '从2026年10月起招募', 'PLAYER PROGRESS': '球员进度', '01 / 01': '01 / 01', 'of': '/', 'committed players': '名已承诺参与的球员', '7 committed': '7名已加入', '11 to go': '还需11名',
  'Help us turn a shared interest into a team.': '与我们一起将共同兴趣发展成一支球队。', 'Become One of the 18': '成为18名球员之一', 'Current committed players': '目前已承诺参与的球员', 'Target number of committed players': '目标球员人数', 'Academic year goal': '目标学年',
  'A note from our student organisers': '学生筹备小组的话', 'A place to learn': '一起学习', 'and': '并', 'belong.': '找到归属。',
  'The EdUHK Lacrosse Interest Group is a student-led community built around participation, development, and connection. Whether you are picking up a stick for the first time or already have lacrosse experience, you are welcome to join us. Together, we hope to create an active and supportive environment and build towards representing EdUHK as a lacrosse team.': '教大棍网球兴趣小组是一个以参与、发展和交流为核心的学生主导社群。无论你是第一次拿起球棍，还是已有棍网球经验，我们都欢迎你加入。让我们一起营造积极互助的环境，并朝着组建代表EdUHK的棍网球队迈进。',
  '“Seven players have started the journey. Help us reach eighteen.”': '“七位球员已踏上旅程，邀请你与我们一起达成十八人的目标。”', 'MESSAGE FROM THE STUDENT ORGANISING GROUP': '学生筹备小组寄语',
  '03 / TRAINING': '03 / 训练', 'Meet us on the field': '球场见', 'Regular training': '定期', 'sessions': '训练课节',
  'We currently organise regular training sessions for students who want to learn, practise, and develop their lacrosse skills. Please contact us before attending because schedules, venues, equipment arrangements, and session details may change.': '我们现正为希望学习、练习及提升棍网球技术的学生安排定期训练课节。出席前请先联系我们，因为时间、场地、器材安排及课节详情可能有所调整。',
  'MONDAY': '星期一', 'Block E Artificial Turf': 'E座人造草地', 'EdUHK campus': '香港教育大学校园', 'ARRIVAL / 18:20': '集合时间 / 18:20',
  'Please gather 10 minutes earlier at the Block E Sports Complex Lower Platform, LP Floor, to collect equipment before moving to the artificial turf.': '请提前10分钟在E座体育综合大楼地下平台 LP层集合，领取器材后前往人造草地。',
  'Fundamental skills, passing, catching, movement, shooting, team concepts, and small-sided games.': '练习基本技巧、传球、接球、移动、射门、团队概念及小型比赛。',
  'THURSDAY': '星期四', 'ARRIVAL / 10:20': '集合时间 / 10:20', 'Skills development, game understanding, fitness, positional practice, and match-based activities.': '提升技巧和比赛理解，并进行体能、位置练习及模拟比赛活动。',
  'Plan to join us?': '准备好加入吗？', 'Training times and arrangements may be adjusted depending on campus facilities, weather, academic commitments, equipment availability, and group needs. Contact us before attending your first session.': '训练时间及安排可能因校园设施、天气、学业安排、器材供应及小组需要而调整。首次出席前请先联系我们。', 'Ask About Training': '咨询训练安排',
  'ALL EXPERIENCE LEVELS': '欢迎不同经验程度', 'Curious about a new sport?': '想试试新运动？', 'New to': '初次接触', 'lacrosse': '棍网球', '?': '？',
  'No previous lacrosse experience is required. We welcome students who are curious about trying a new sport, as well as students who have played lacrosse before. Sessions will introduce the basic rules, equipment, movement patterns, and core skills step by step.': '无需具备棍网球经验。我们欢迎想尝试新运动的学生，也欢迎曾接触棍网球的同学。训练课节会循序渐进地介绍基本规则、器材、移动方式及核心技巧。',
  'I’m New to Lacrosse': '我是棍网球新手', 'I Have Playing Experience': '我有棍网球经验', 'Contact us': '联系我们', 'Send a message or complete the interest form.': '发送消息或填写兴趣登记表。', 'Attend a session': '参加训练课节', 'Meet the group and take part at your own pace.': '认识小组成员，按自己的步伐参与。', 'Learn and commit': '持续学习与投入', 'Develop your skills and help us work towards forming the team.': '提升技术，帮助我们朝组建球队的目标迈进。',
  '04 / ACTIVITIES': '04 / 活动', 'A little bit of everything': '多元活动体验', 'What we do': '我们的活动',
  'BEGINNER': '新手友好', 'Beginner Lacrosse Sessions': '棍网球入门课节', 'Start with the basics in a supportive setting. No experience needed—just bring your curiosity.': '在互相支持的环境中从基本技巧开始。无需经验，只要带着好奇心来参加。',
  'SKILLS': '技巧训练', 'Stick Skills and Passing': '球棍技巧与传球', 'Build control and confidence through progressive catching, cradling, and passing drills.': '通过循序渐进的接球、持球及传球练习，提升控球能力与自信。',
  'ALL LEVELS': '适合各程度', 'Small-Sided Games': '小型比赛', 'Learn by playing, practise decisions, and enjoy friendly game scenarios at every level.': '在比赛中学习、练习判断，并享受适合不同程度的友好赛事情境。',
  'Shooting and Finishing': '射门与完成进攻', 'Explore accuracy, technique, and creative ways to finish around goal.': '探索射门准确度、技巧，以及在球门附近完成进攻的方法。',
  'FITNESS': '体能训练', 'Speed, Agility, and Fitness': '速度、敏捷与体能', 'Develop movement, coordination, and match-ready fitness through varied activities.': '通过多元活动提升移动能力、协调性及比赛所需体能。',
  'COMMUNITY': '社群交流', 'Team-Building Activities': '团队建设活动', 'Get to know one another, build trust, and shape the student community together.': '互相认识、建立信任，并共同塑造学生社群。',
  '05 / COMMUNITY': '05 / 社群', 'The way we play and grow': '共同参与与成长', 'What we': '我们重视', 'value.': '的价值。', 'There is room in our group for different starting points, strengths, and ambitions. We want everyone to feel welcome and able to contribute.': '小组欢迎不同起点、长处与目标的同学。我们希望每位成员都感到受欢迎，并能够作出贡献。',
  'Commitment': '投入', 'Show up, stay curious, and help the group move forward.': '持续参与、保持好奇，并帮助小组前进。', 'Inclusion': '共融', 'Make space for every student, skill level, and background.': '接纳不同学生、技术程度与背景。', 'Teamwork': '团队合作', 'Support one another on the field and beyond it.': '在球场内外互相支持。', 'Respect': '尊重', 'Play with care, listen well, and value the people around us.': '用心参与、认真聆听，并珍视身边的人。', 'Growth': '成长', 'Learn from practice, challenges, and each other.': '从训练、挑战及彼此交流中学习。', 'Wellbeing': '身心健康', 'Enjoy movement and build healthy habits together.': '享受运动，一起建立健康习惯。',
  'YOU’RE WELCOME IF YOU’RE A…': '欢迎以下同学加入……', 'Complete beginner': '棍网球初学者', 'Experienced player': '有经验的球员', 'Student from any programme': '任何专业的学生', 'Future coach or sports leader': '有志成为教练或体育领袖的学生', 'Student who wants to stay active': '希望保持活跃的学生', 'Community builder': '希望建设新社群的学生',
  '06 / JOIN US': '06 / 加入我们', 'Your next move starts here': '你的下一步从这里开始', 'Join the first': '加入首个', 'team-building': '球队建设', 'journey.': '旅程。',
  'We are looking for students who are interested in lacrosse and willing to contribute to the development of the group. You do not need to be an expert, but regular participation, enthusiasm, teamwork, and commitment will help us move towards our goal of forming an EdUHK lacrosse sports team during the 2026–27 academic year.': '我们希望邀请对棍网球有兴趣并愿意为小组发展作出贡献的学生加入。你无需是专家；定期参与、热情、团队合作和投入，将帮助我们朝着2026–27学年组建EdUHK棍网球运动队的目标迈进。',
  'CURRENT GROUP': '目前小组人数', '7 committed players': '7名已承诺参与的球员', 'WE HOPE TO REACH': '我们希望达到', '18 committed players': '18名已承诺参与的球员', 'starting from October 2026': '从2026年10月起', 'TAKE PART IN WHAT’S NEXT': '参与接下来的旅程', 'Come build': '一起来建设', 'with us.': '我们的球队。', 'Say hello, ask about training, or tell us what you’re interested in.': '欢迎打个招呼、咨询训练，或告诉我们你感兴趣的内容。', 'PHONE / WHATSAPP': '电话 / WhatsApp', 'EMAIL': '邮箱', 'Join the Group': '加入小组', 'Contact Us on WhatsApp': '通过WhatsApp联系我们',
  '07 / GOOD TO KNOW': '07 / 常见问题', 'Questions, answered': '解答你的疑问', 'Frequently asked': '常见', 'questions': '问题',
  'Do I need previous lacrosse experience?': '我需要有棍网球经验吗？', 'No. Beginners are welcome, and we will introduce basic skills, rules, equipment, and game activities step by step.': '不需要。我们欢迎初学者，并会循序渐进地介绍基本技巧、规则、器材及比赛活动。',
  'Do I need to own a lacrosse stick?': '我需要自备球棍吗？', 'Not necessarily. Contact the organising group before attending so we can explain current equipment arrangements and availability. If you are browsing options, the': '不一定。出席前请先联系筹备小组，了解现时器材安排及供应情况。如果你正在了解球棍选择，', 'Nike Surge LT lacrosse stick': 'Nike Surge LT棍网球球棍', 'is one example—please check sizing and suitability with us before purchasing.': '是其中一个例子；购买前请先向我们确认尺寸及是否合适。',
  'Where should I go before training?': '训练前应该在哪里集合？', 'Gather at the Block E Sports Complex Lower Platform, LP Floor. We will collect equipment before going to the Block E Artificial Turf.': '请在E座体育综合大楼地下平台 LP层集合。领取器材后，我们会前往E座人造草地。',
  'What should I wear?': '应该穿什么？', 'Wear comfortable sports clothing and suitable athletic shoes. Bring water and any personal sports equipment you already have.': '请穿舒适的运动服和合适的运动鞋，并带上饮用水及已有的个人运动器材。',
  'Can students from any programme join?': '任何专业的学生都可以加入吗？', 'Yes. The group welcomes students from different programmes who are interested in learning, participating, and helping to build the community.': '可以。小组欢迎不同专业、对学习、参与及建设社群有兴趣的学生加入。',
  'Is this already an official EdUHK team?': '这已经是EdUHK官方球队吗？', 'We are currently a student-led lacrosse interest group working towards forming a sports team during the 2026–27 academic year. Official team status and future competitions will depend on the relevant approval and development process.': '我们目前是学生主导的棍网球兴趣小组，正努力于2026–27学年组建运动队。官方球队资格及未来比赛安排将取决于相关审批和发展程序。',
  'How can I become one of the committed players?': '如何成为已承诺参与的球员之一？', 'Contact us by WhatsApp or email, attend training regularly, and speak with the organising group about your interest and availability.': '请通过WhatsApp或邮箱联系我们，定期参加训练，并与筹备小组沟通你的兴趣和时间安排。',
  '08 / CONTACT': '08 / 联系我们', 'Your place on the field is waiting': '球场上有你的位置', 'Ready to pick': '准备好拿起', 'up a': '一支', 'stick?': '球棍了吗？',
  'Interested in trying lacrosse, returning to the sport, or helping us build the first EdUHK lacrosse team? Contact us and join the journey.': '想尝试棍网球、重返球场，或帮助我们建设第一支EdUHK棍网球队？联系我们，一起加入这段旅程。',
  'TRAINING': '训练时间', 'Monday 18:30–20:30': '星期一 18:30–20:30', 'Thursday 10:30–12:30': '星期四 10:30–12:30', 'VENUE / ARRIVAL': '场地 / 集合地点', 'Gather at Block E Sports Complex Lower Platform, LP Floor, to collect equipment.': '请在E座体育综合大楼地下平台 LP层集合领取器材。', 'Send an Email': '发送邮件', 'Message on WhatsApp': '通过WhatsApp发送消息', 'Learn together. Play together. Build the team together.': '一起学习，一起参与，一起建设球队。',
  'The Education University of Hong Kong': '香港教育大学', 'A student-led community working towards forming a lacrosse sports team during the 2026–27 academic year.': '学生主导的社群，正努力于2026–27学年组建棍网球运动队。', 'Learn · Play · Build': '学习 · 参与 · 共建', 'EdUHK Lacrosse Interest Group': '教大棍网球兴趣小组', 'This website represents a student-led interest group. It is not an official university website unless separately approved by The Education University of Hong Kong.': '本网站代表一个学生主导的兴趣小组。除非另获香港教育大学批准，否则本网站并非大学官方网站。',
  'Footer navigation': '页脚导航', 'Student organising group': '学生筹备小组', 'Field lacrosse stick angled upward, with a narrow throat, flared triangular head, netted pocket, and ball': '向右上方倾斜的棍网球球棍，具有窄喉部、外展三角形球头、网袋及球。',
  'Committed players towards the target of 18': '朝18名球员目标迈进的已承诺参与球员人数', '7 of 18 committed players': '18名目标中的7名已承诺参与球员',
  'EdUHK Lacrosse Emblemcrest showing the green-and-orange lacrosse crest': 'EdUHK棍网球徽章，呈现绿橙色球棍图案。'
};

const localeDictionaries = { 'zh-hant': traditionalChinese, 'zh-hans': simplifiedChinese };
const originalTextNodes = [];
const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (textWalker.nextNode()) originalTextNodes.push({ node: textWalker.currentNode, original: textWalker.currentNode.nodeValue });

function supportedLanguage(value) {
  return value === 'en' || value === 'zh-hant' || value === 'zh-hans' ? value : null;
}

function detectBrowserLanguage() {
  const candidates = [...(navigator.languages || []), navigator.language || ''];
  if (!candidates.some(Boolean)) return 'zh-hant';
  for (const candidate of candidates) {
    const language = candidate.toLowerCase();
    if (/^zh-(hk|tw|mo)(-|$)/.test(language)) return 'zh-hant';
    if (/^zh-(cn|sg|my)(-|$)/.test(language)) return 'zh-hans';
  }
  return 'en';
}

function languageFromLocation() {
  const hashLanguage = supportedLanguage(window.location.hash.slice(1).toLowerCase());
  const queryLanguage = supportedLanguage(new URLSearchParams(window.location.search).get(languageQueryKey));
  return hashLanguage || queryLanguage;
}

function localizeAttributes(language, dictionary) {
  const attributes = [
    ['.site-header .brand', 'aria-label', 'EdUHK Lacrosse Interest Group home'],
    ['.footer-brand', 'aria-label', 'EdUHK Lacrosse Interest Group home'],
    ['.skip-link', 'aria-label', 'Skip to content'],
    ['.primary-navigation', 'aria-label', 'Main navigation'],
    ['.language-switcher', 'aria-label', 'Choose language'],
    ['.menu-toggle', 'aria-label', 'Open navigation'],
    ['.hero-emblem', 'alt', 'EdUHK Lacrosse Emblemcrest showing the green-and-orange lacrosse crest'],
    ['.team-photo-feature img', 'alt', 'EdUHK lacrosse team posing together on the field after a competition'],
    ['.team-photo:nth-child(2) img', 'alt', 'Lacrosse players huddle together before a game'],
    ['.team-photo:nth-child(3) img', 'alt', 'EdUHK lacrosse players gathering for a team talk on the field'],
    ['.progress-track', 'aria-label', 'Committed players towards the target of 18'],
    ['.progress-track', 'aria-valuetext', '7 of 18 committed players'],
    ['.site-footer nav', 'aria-label', 'Footer navigation']
  ];
  attributes.forEach(([selector, attribute, source]) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, dictionary[source] || source);
  });

  document.querySelectorAll('.language-switcher button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
}

function updateLanguageUrl(language) {
  const url = new URL(window.location.href);
  const hashIsLanguage = supportedLanguage(url.hash.slice(1).toLowerCase());
  if (hashIsLanguage && !url.searchParams.has(languageQueryKey)) {
    url.hash = language;
  } else {
    url.searchParams.set(languageQueryKey, language);
    if (hashIsLanguage) url.hash = '';
  }
  window.history.replaceState({}, '', url);
}

function setLanguage(language, updateUrl = false) {
  const selectedLanguage = supportedLanguage(language) || 'zh-hant';
  const dictionary = localeDictionaries[selectedLanguage] || {};
  document.documentElement.lang = selectedLanguage === 'zh-hant' ? 'zh-Hant' : selectedLanguage === 'zh-hans' ? 'zh-Hans' : 'en';
  document.title = selectedLanguage === 'zh-hant' ? 'EdUHK 教大棍網球興趣小組' : selectedLanguage === 'zh-hans' ? 'EdUHK 教大棍网球兴趣小组' : 'EdUHK Lacrosse Interest Group';

  originalTextNodes.forEach(({ node, original }) => {
    const key = original.trim();
    const translation = dictionary[key];
    if (!node.isConnected) return;
    if (selectedLanguage === 'en') {
      node.nodeValue = original;
      return;
    }
    if (!translation) return;
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translation}${trailing}`;
  });

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = selectedLanguage === 'zh-hant'
      ? '加入香港教育大學學生主導的教大棍網球興趣小組，一起學習、訓練，朝2026–27學年組建球隊的目標邁進。'
      : selectedLanguage === 'zh-hans'
        ? '加入香港教育大学学生主导的教大棍网球兴趣小组，一起学习、训练，朝2026–27学年组建球队的目标迈进。'
        : 'Join the student-led EdUHK Lacrosse Interest Group. Learn the sport, meet teammates, and help build towards an EdUHK lacrosse team for 2026–27.';
  }

  localizeAttributes(selectedLanguage, dictionary);
  const currentPlayerCount = document.querySelector('.join-target strong');
  if (currentPlayerCount) currentPlayerCount.textContent = dictionary['7 committed players'] || '7 committed players';
  try { localStorage.setItem(languageStorageKey, selectedLanguage); } catch { /* Storage may be unavailable in private or restricted browsing. */ }
  if (updateUrl) updateLanguageUrl(selectedLanguage);
}

document.querySelectorAll('.language-switcher button').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language, true));
});

let savedLanguage = null;
try { savedLanguage = supportedLanguage(localStorage.getItem(languageStorageKey)); } catch { /* Browser storage is optional. */ }
setLanguage(languageFromLocation() || savedLanguage || detectBrowserLanguage());
