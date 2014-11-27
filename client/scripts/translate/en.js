(function (app) {
    'use strict';

    app.config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('en', {
            INDEX_OTHER_LANGUAGE: 'Español',
            INDEX_SIGN_IN: 'Sign In',
            INDEX_SIGN_UP: 'Sign Up',
            INDEX_MY_ACCOUNT: 'My Account',
            INDEX_SETTINGS: 'Settings',
            INDEX_SIGN_OUT: 'Sign Out',
            INDEX_OUR_COMPANY: 'Our Company',
            INDEX_ABOUT_US: 'About Us',
            INDEX_LEADERSHIP: 'Leadership',
            INDEX_SUPPORT: 'Support',
            INDEX_TERMS_OF_USE: 'Terms of Use',
            INDEX_PRIVACY_POLICY: 'Privacy Policy',
            INDEX_CONTACT_US: 'Contact Us',
            INDEX_CONNECT_WITH_US: 'Connect With Us',
            INDEX_DISCLAIMER: 'Use of the YipTV service and this Web site constitutes acceptance of our ',
            HOME_UNLIMITED_CHANNELS: 'Unlimited Channels',
            HOME_MONTH: 'month',
            HOME_WATCH_LIVE: 'Watch live news, sports & events from around the world',
            HOME_WATCH_ANY_DEVICE: 'Watch on your TV, Tablet, Phone PC, Game System and more.',
            HOME_NO_CONTRACTS: 'No Contracts, Cancel Any Time',
            HOME_WATCH_ANY_SCREEN: 'Watch on any screen, anywhere, any time.',
            HOME_NO_CABLE_BOX: 'No cable box needed. No bulky dish on the roof. Yip TV plays your channels through your broadband Internet connection.',
            HOME_JOIN_REVOLUTION: '>> Join the revolution',
            HOME_TESTIMONIALS: 'Testimonials',
            HOME_TESTIMONIAL_1: '1 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            HOME_TESTIMONIAL_2: '2 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            HOME_TESTIMONIAL_3: '3 Lorem ipsum dolor sit amet, te nusquam epicurei intellegebat vix. Qui id probo conceptam consetetur. Tale delicata no pro. Cum an habemus definitiones, utinam scripta quaeque cu pri, diam graecis corpora an sit. Dissentiunt accommodare instructior ea usu.',
            SIGN_IN_HEADING: 'Sign In',
            SIGN_IN_EMAIL: 'Email',
            SIGN_IN_EMAIL_REQUIRED: 'Enter your email',
            SIGN_IN_EMAIL_INVALID: 'Enter a valid email',
            SIGN_IN_PASSWORD: 'Password',
            SIGN_IN_PASSWORD_REQUIRED: 'Enter your password',
            SIGN_IN_SUBMIT_BUTTON: 'Sign In',
            SIGN_IN_FORGOT_PASSWORD: 'Forgot Password?',
            SIGN_IN_RESET_PASSWORD: 'Reset Password',
            SIGN_IN_NOT_REGISTERED: 'Not Registered Yet?',
            SIGN_IN_SIGN_UP: 'Sign Up',
            TERMS_OF_USE_HEADING: 'Terms of Use',
            PRIVACY_POLICY_HEADING: 'Privacy Policy',
            LEADERSHIP_HEADING: 'Leadership',
            ABOUT_US_HEADING: 'About Us',
            ABOUT_US_EXECUTIVES_TITLE: 'Our Executives',
            ABOUT_US_CHAIRMAN_NAME: 'Michael Tribolet, Chairman, Co-Founder, & CEO',
            ABOUT_US_CHAIRMAN_DESCRIPTION: 'Michael Tribolet is a result driven entrepreneur with extensive experience in building & selling fast growth high-tech small business, enterprise networks and consumer based businesses. His competency includes administration, business development, customer care, marketing, operations, sales, strategy and overall management of companies. With over 20+ years experience building privately and publicly owned companies with cross border operations, Michael has been instrumental in developing strategy and achieving the tactical milestones necessary to manage company growth. Most recently, Michael served as CEO/Managing Director of ACN Europe, where he was responsible for $500M+ Annual Revenues in direct marketing sales of telecommunications, broadband and energy products. Prior to ACN, he was brought on to serve as President at VONAGE growing the company to 2.6 million paying customers increasing revenues from $2M – $900M in less than 5 years. Michael participated in the raising of $1Billion dollars during his tenure at Vonage and responsibilities included overseeing sales, marketing, customer care and a variety of operational functions such as system operations & applications management, carrier relations, network operations, logistics and quality assurance. Prior to joining Vonage, Mr. Tribolet served as Vice President of Operations at Dialpad Communications which sold to Yahoo. Prior to Dialpad, Mr. Tribolet served as President of Data Products International where he oversaw the global build-out of Internet telephony services.',
            ABOUT_US_EVP_NAME: 'Carmen Tribolet, Co-Founder & Executive VP',
            ABOUT_US_EVP_DESCRIPTION: 'Carmen Tribolet has over 15 years of proven Telecommunications experience. She served as Director of The Americas for Telecom Italia Sparkle where she was responsible for overseeing their International data/IP sales and marketing efforts. During her tenure, she successfully brought in key global accounts and tripled revenues among their Latin America, Europe and Asian Markets. Telecom Italia is one of the largest telecom companies in the world with annual revenues of $31Billion. Prior to TIS, Carmen managed International Voice operations for IDT Telecom where she played a key role within their cost saving objectives and international commercial initiative. IDT&#39;s annual revenues are $1.6B and is the leader in prepaid calling around the world.',
            ABOUT_US_CLO_NAME: 'Chuck Gaspari, Co-Founder & CLO',
            ABOUT_US_CLO_DESCRIPTION: 'Chuck Gaspari currently serves as a Senior Partner at Eleven Canterbury, Chuck is a specialist in strategic business consulting and capital sourcing. As both an internal/external consultant, he has partnered with chief executives and other senior officers on strategic planning and operations encompassing start-up development, marketing, sales, mergers and acquisitions, and corporate policies and practices. In addition, Mr. Gaspari founded G&G Sports and Entertainment Group, Inc. whose portfolio includes teams/clients in the NBA, NHL, PGA, LPGA and Major League Baseball, and focuses on business consulting, strategic alliances, marketing/sales/distribution strategies, planning, feasibility, contract negotiations, and public and media relations. Chuck also served as White House Staff assistant to then Vice President George H.W. Bush. He is a member of the Florida Bar and the United States District Court for the Southern District of Florida. Mr. Gaspari is also a licensed investment banker.',
            ABOUT_US_CFO_NAME: 'Mark Holodnak, CFO',
            ABOUT_US_CFO_DESCRIPTION: 'Mark Holodnak has had an extensive career spanning from IBM, GE Capital, Tetra Pak, Inter- Tel and most notably as the founding VP Finance/Controller for Vonage (pre-IPO). At Vonage he was instrumental in creating the Finance department and implementing systems and processes that became the foundation for its exponential growth and eventual IPO. His record of achievement includes establishing a World-class finance operation including financial reporting, cash management, treasury, risk management, budgeting and forecasting, contract negotiation and inventory management. Since Vonage he has advised various companies on acquisitions, due diligence, and system implementations. In this capacity, he has assisted both buyers and sellers and has significant experience working with private equity firms and investment bankers. Most recently, He managed a two year-long turnaround, investment valuation, equity sale and eventual wind-down of a diversified media venture. He holds an MBA from Rider University in Lawrenceville NJ has lived in the New York City area for many years and now resides in Phoenix, AZ with his family.',
            ABOUT_US_CMO_NAME: 'Ian Wismann, Chief Marketing Officer',
            ABOUT_US_CMO_DESCRIPTION: 'Ian Wismann’s career has spanned two decades at Fortune 100 firms including Citibank and Chase, and nimble start ups including Vonage and Snackable Media. A digital marketing veteran, he has generated a half billion dollars in start up revenues. At Vonage he conceived and executed the online acquisition plan that acquired the majority of the firm&#39;s customers between 2002 - 2005, and also launched the brand internationally. At Snackable Media, Ian spearheaded partnerships with MTV Networks, Endemol, and other television stakeholders to generate revenue streams that capitalized on television content extensions to mobile devices. In 2010 Ian billed nearly 1% of all mobile premium SMS revenues in the United States, and his VH1 Text 2 Win product was nominated for a Mobile Excellence Award for Best Category Extension in Television. Ian is a former Partner at the advertising agency Ogilvy & Mather and has served on the Board of Directors of the Bankers Conseco Life Insurance Company since 2001. Additionally he serves on the Board of Directors of Seven Minds, a mobile software developer that produces assistive technology for special needs children on three continents. Ian is married with four children, and holds an MBA in Information Systems from Fordham University.',
            ABOUT_US_CIO_NAME: 'Giancarlo Paolillo, Chief Information Officer',
            ABOUT_US_CIO_DESCRIPTION: 'Giancarlo Paolillo has held positions ranging from CIO at ACN, CTO at X Plus One, and Head of Emerging Technologies for Household International (now HSBC) where he was responsible for the design and support of over 30 million credit card customers within their E-commerce solutions in EU and USA. In addition Giancarlo was the Senior VP of Engineering for Vonage where he scaled the infrastructure and software development solutions from 6 points of presence to 36 in under two years with clients from less than 100k to greater than 2 million. His responsibilities and experience encompass Network infrastructure, Systems engineering, Capacity planning, Network security, Ecommerce infrastructure, Data Base and data warehouse solutions, backup strategies, Storage Area Networks and NOC; building, redesigning, security within the Infrastructure and software engineering of each organization dealing with Network, Systems, and Applications and has created security teams trained by him. During the span of his career, Giancarlo has built data centers; ground up Security teams; disaster recovery sites; migrated companies to meet SOX/AS5 compliance; Storage Life Management solutions; Re-vamped software architectures to scale; while reducing overall complexity and increasing our ROI.',
            ABOUT_US_VPCA_NAME: 'Victor Iasprizza, VP Content Acquisition',
            ABOUT_US_VPCA_DESCRIPTION: 'Victor Iasprizza brings over 15 years of telecommunications sales and management experience in both Latin America and Europe, where he was responsible for growing Latinode’s international wholesale and retail voice business. His responsibilities included P & L accountability, expansion of LATAM & EMEA regions along with development of emerging markets.Victor&#39;s leadership led to the successful growth of 35% with over $180M annual revenues and included notable recognition as Hispanic Business Fastest-Growing Company in 2004, 2005 and 2006',
            ABOUT_US_VPBD_NAME: 'Sekar Desamangalam, VP of Business Development',
            ABOUT_US_VPBD_DESCRIPTION: 'Sekar Desamangalam most recently served as Director with Virtus Global Partners where he worked on US-India cross border initiatives - M&A, JV and Alliances. He brings over 20 years of experience in Engineering & Technology industry. Prior to Virtus Global, Sekar was responsible for CPE product development and Corporate Business Development at Vonage. In this capacity, he also worked on new market entry initiatives including an India Entry Strategy for Vonage. Sekar&#39;s past experience also includes stints at General Electric and Bechtel Power Corporation working on global projects that spanned UK, China and Europe, besides the North American market. Sekar holds an MBA from New York University, Stern School of Business, an MS from the University of South Florida, Tampa and a BE from the Birla Institute of Technology & Science, Pilani, India.',
            ABOUT_US_DIRECTORS_TITLE: 'Our Board of Directors',
            ABOUT_US_BA1_NAME: 'Michael Snyder, Board Advisor',
            ABOUT_US_BA1_DESCRIPTION: 'Michael Snyder, has been Consultant of Mergers & Acquisitions at Patient Portal Technologies, Inc. since May 2008. Mike served as Chief Executive Officer of Red Hawk Fire & Security, LLC. Since 2007, Mike has also been a Consultant at several companies. He was an Operating Executive at AUA Private Equity Partners, LLC. Mr. Snyder was responsible for Business Services sector investments. Mike Snyder served as the Chief Executive Officer at Vonage Holdings Corp. from February 8, 2006 to April 11, 2007, and also served as Director of the firm from March 2006 to April 11, 2007. He served as the Chief Executive Officer of Vonage Network of New Jersey Inc. (formerly, Vonage Network Inc.) and Vonage Network LLC. Since February 2006, he served as the Chief Executive Officer at Sungjee Construction Co., Ltd. He has more than 30 years of experience in the industry. From 1997 to February 2006, he served as the President and Chief Operating Officer at ADT Security Services, Inc, North America. Mike joined ADT in 1977 and served in various positions prior to 1997. He has been Executive Chairman of Castlerock Security Holdings, Inc. since September 2010. Mike serves as Director of Castlerock Security Holdings, Inc. He serves as a Director of CitraPAc. He also serves as Member of Advisory Board at Proximex, Patient Portal Technologies, Inc., and Safe & Secure TV Channel, Inc. He serves as a Board Member for the National Crime Prevention Council. Mr. Snyder served as a Director of Sungjee Construction Co., Ltd., since March 2006. Mike served as a Director of Talon International, Inc. from July 2010 to April 9, 2012. He served as a Director of Patient Portal Technologies, Inc. since May 2008. Mr. Snyder holds a B.A. degree from The State University of New York at Oswego, Oswego, NY.',
            ABOUT_US_BA2_NAME: 'Ed Rodriquez, Board Advisor',
            ABOUT_US_BA2_DESCRIPTION: 'Ed Rodriguez has over 14 years of Hi-Tech Sales, Product Management and Consulting Services experience. He currently leads Citrix Systems (CTXS) Inside Sales division for North and South America, encompassing their small business and mid-market segments in addition to their Subscription and Hardware Maintenance Renewals teams which exceeds $500M in annual revenues. In prior roles at Citrix, Ed helped pave the way for new products leading product development releases, participating in Board meetings and building sales teams focused on emerging markets and vertical channels. He has a degree in Computer Science and started his career at a boutique Consulting organization before joining Citrix and spending 5 years Consulting with Fortune 1000 companies on Virtualization and Mobility initiatives.',
            ABOUT_US_BA3_NAME: 'Dan Lovatt, Board Advisor',
            ABOUT_US_BA3_DESCRIPTION: 'Dan Lovatt has over 30 years of experience in multi-national telecommunication and telecommunications manufacturing in the United States as well as Internationally. Most Recently, Dan served as Chief Executive Officer for PCCW Global where he was responsible for managing the Company&#39;s International Business outside of their home Market of China. Prior to PCCW, he worked as the International CFO for Lucent Technologies as well a number of Services Partners, Content Providers, Telecom Authorities and Governmental Agencies where he held various management positions.',
            ABOUT_US_BA4_NAME: 'Bryan Buckley, Board Advisor',
            ABOUT_US_BA4_DESCRIPTION: 'Commercial Director Bryan Buckley is an acclaimed award winning advertising and production executive directing over 40 Super Bowl commercials and dubbed as "The King of Superbowl" by the New York Times. Bryan&#39;s career began in 1994 with his inception of ESPNs now benchmark "This is Sportscenter" campaign. Since then, Bryan has received virtually every honor, award, and accolade in the industry securing his spot atop "best of" lists in the US and internationally. Mr. Buckley is Co-Founder of Hungryman Productions, one of the world&#39;s largest and leading creative production agencies and has been named Commercial Director of the Year by the Directors Guild of America.',
            CONTACT_US_HEADING: 'Contact Us'

        });
    }]);
}(angular.module('app')));
