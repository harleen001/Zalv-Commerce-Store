/**
 * Everything editable about the info pages lives here.
 * ► Add your support email / phone below and they appear automatically on the site.
 */
export const siteInfo = {
  brand: 'ZALV',
  location: 'Jalandhar, Punjab, India',
  instagram: 'https://www.instagram.com/p/DS-1spNE12y/?stkn=MWtvNTFsOG5rYnM3dw==',
  email: '', // e.g. 'hello@zalv.in'  (leave empty to hide)
  phone: '', // e.g. '+91 98765 43210' (leave empty to hide)
  updated: 'September 19, 2026',
};

export type Block = string | { list: string[] } | { contact: string };
export type PolicySection = { heading: string; body: Block[] };
export type PolicyDoc = { path: string; title: string; intro?: string; numbered?: boolean; sections: PolicySection[] };

export const termsDoc: PolicyDoc = {
  path: '/terms-and-conditions',
  title: 'Terms & Conditions',
  numbered: true,
  sections: [
    { heading: 'Introduction', body: [
      'Welcome to the ZALV website (“Website”). This website is operated by ZALV, based in Jalandhar, Punjab, India. Throughout the site, the terms “we,” “us,” and “our” refer to ZALV. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions (“Terms”). Please read them carefully before using our website.',
    ] },
    { heading: 'Use of the website', body: [{ list: [
      'You must be at least 16 years old to use this website. By using the website, you confirm that you meet this age requirement.',
      'You agree to use this website only for lawful purposes and in a way that does not infringe on the rights of or restrict others from using the website.',
      'You may not use our products or services for any illegal or unauthorized purposes.',
    ] }] },
    { heading: 'Intellectual property', body: [{ list: [
      'All content on this website, including but not limited to text, graphics, logos, images, and software, is the exclusive property of ZALV and is protected by intellectual property laws.',
      'You may not reproduce, distribute, modify, or create derivative works from any content on this website without our explicit written permission.',
    ] }] },
    { heading: 'Product information', body: [{ list: [
      'We strive to display our products as accurately as possible; however, colors and details may vary depending on display settings. Leather is a natural material, so grain, small marks and shade differences are part of every piece.',
      'We reserve the right to limit the availability of any product or service at any time. All product descriptions and pricing are subject to change without prior notice.',
    ] }] },
    { heading: 'Orders and payments', body: [{ list: [
      'By placing an order, you agree to provide accurate and complete purchase and account information, including a reachable phone number and a complete delivery address.',
      'We reserve the right to accept, refuse, or cancel any order at our discretion. If an order is modified or canceled, we will notify you using the contact details provided at checkout.',
      'ZALV currently accepts Cash on Delivery (COD) only. Payment is collected in cash when your order is delivered. There are no extra charges for Cash on Delivery.',
      'Refunds, where applicable, are handled as described in our Return & Exchange Policy.',
    ] }] },
    { heading: 'Shipping and delivery', body: [{ list: [
      'Delivery times vary based on your location. Please see our Shipping Policy for details.',
      'ZALV is not responsible for delays, damages, or lost shipments caused by shipping carriers, but we will help you follow up with the carrier wherever we can.',
    ] }] },
    { heading: 'Returns and refunds', body: [{ list: [
      'Please refer to our Return & Exchange Policy for details on exchanges and refunds.',
      'All sales are considered final unless specified otherwise in our Return & Exchange Policy.',
    ] }] },
    { heading: 'Limitation of liability', body: [{ list: [
      'ZALV shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or the purchase of our products.',
      'Our total liability shall not exceed the amount you paid for the purchased product.',
    ] }] },
    { heading: 'Changes to terms', body: [{ list: [
      'We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the website following any changes constitutes acceptance of the new Terms.',
    ] }] },
    { heading: 'Governing law', body: [{ list: [
      'These Terms shall be governed by and interpreted in accordance with the laws of India.',
    ] }] },
    { heading: 'Contact information', body: [{ contact: 'If you have any questions regarding these Terms, you can contact us' }] },
  ],
};

export const shippingDoc: PolicyDoc = {
  path: '/shipping-policy',
  title: 'Shipping Policy',
  sections: [
    { heading: 'Order processing', body: [{ list: [
      'Orders are processed and dispatched within 48 hours of being placed, subject to product availability. We do not dispatch on weekends or major public holidays, so those days are not counted in the 48 hours.',
      'Once an order is placed, it cannot be modified or canceled. Please review your items, sizes, phone number and address carefully before completing checkout.',
      'All orders are shipped from Jalandhar, Punjab, India.',
      'You can follow the status of your order (confirmed, shipped, delivered) from your account. We may also call or message the phone number you gave us to confirm your address or delivery.',
      'In rare cases, high demand may cause an item to become unavailable after an order is placed. If this happens, we will contact you and cancel the order. Because we only collect payment on delivery, nothing will have been charged.',
      'For security reasons, ZALV reserves the right to cancel any order at its discretion.',
      'Please note that orders may experience delays during special launches, holiday seasons, or promotional sales.',
    ] }] },
    { heading: 'Shipping within India', body: [{ list: [
      'ZALV offers complimentary standard shipping on all orders within India, with no minimum order value.',
      'Estimated delivery time is 5–7 business days after dispatch, depending on your location.',
      'Estimated delivery times do not include the 48-hour processing window and may vary because of courier delays, weather or local restrictions.',
    ] }] },
    { heading: 'Cash on delivery', body: [{ list: [
      'Cash on Delivery (COD) is available on every order. You pay the delivery partner in cash when your order arrives. There are no extra COD charges.',
      'Please make sure someone is available at the delivery address to receive the order and that the phone number you entered is reachable. If the courier cannot reach you, or the order is refused at the door, we may cancel it.',
    ] }] },
    { heading: 'International shipping', body: ['We currently ship within India only.'] },
    { heading: 'Lost, stolen or damaged packages', body: [
      'Once an order is marked as delivered by the courier, ZALV is not responsible for lost, stolen, or damaged packages. The courier assumes all risks after proof of delivery is provided.',
      'If a parcel looks damaged or tampered with when it arrives, please tell the courier at the door and contact us within 48 hours with photos, so we can look into it.',
    ] },
    { heading: 'Questions about your order', body: [{ contact: 'If you have any additional questions, feel free to reach us' }] },
  ],
};

export const returnsDoc: PolicyDoc = {
  path: '/return-policy',
  title: 'Return & Exchange Policy',
  sections: [
    { heading: 'Exchange window', body: [
      'We accept exchange requests within 7 days of delivery. Our pieces are made in small batches, so exchanges are subject to stock.',
    ] },
    { heading: 'What can be exchanged', body: [{ list: [
      'Jackets and boots can be exchanged for a different size if they are unworn, unwashed and in original condition, with tags and packaging intact.',
      'For boots, please try them on indoors, on a clean surface only. Boots with outdoor wear or marks on the soles cannot be exchanged.',
      'For hygiene reasons, perfumes cannot be exchanged once opened. If a perfume arrives damaged or leaking, see the section below.',
    ] }] },
    { heading: 'Natural variation', body: [
      'Leather is a natural material. Grain, small marks and shade variations are part of each hide and are not defects.',
    ] },
    { heading: 'Damaged, defective or wrong items', body: [
      'If your order arrives damaged, defective or not what you ordered, contact us within 48 hours of delivery with clear photos (and a short unboxing video if you have one). We will arrange a replacement or, if that is not possible, a refund.',
    ] },
    { heading: 'How to request an exchange', body: [
      { contact: 'Contact us within the exchange window' },
      'Please include your name, phone number, order details and the reason for the exchange. Once we have approved your request, we will let you know how to send the item back.',
    ] },
    { heading: 'Refunds', body: [
      'Because ZALV orders are paid on delivery, approved refunds are sent by UPI or bank transfer to the details you share with us. Please allow 5–10 business days for the refund to reflect in your account.',
    ] },
    { heading: 'Final sale items', body: [{ list: [
      'All items purchased during sales, promotions, or markdown events are considered final sale and cannot be returned or exchanged.',
      'ZALV reserves the right to adjust, modify, or discontinue discounts and promotional offers at any time without prior notice.',
      'We do not offer price adjustments if an item you purchased later goes on sale.',
    ] }] },
  ],
};

export const privacyDoc: PolicyDoc = {
  path: '/privacy-policy',
  title: 'Privacy Policy',
  sections: [
    { heading: 'Introduction', body: [
      'This Privacy Policy describes how ZALV (“ZALV”, “we”, “us” or “our”) collects, uses, and discloses your personal information when you visit this website, create an account, place an order, or otherwise communicate with us (together, the “Services”). “You” means the person using the Services, whether a customer, a website visitor, or anyone else whose information we hold.',
      'Please read this Privacy Policy carefully.',
    ] },
    { heading: 'Changes to this policy', body: [
      'We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised policy on this page and update the “Last updated” date.',
    ] },
    { heading: 'Information we collect directly from you', body: [
      'Information that you submit to us through our Services may include:',
      { list: [
        'Contact details, including your name, phone number, email address and shipping address.',
        'Order information, including the items, sizes and quantities you order, your delivery address, and your chosen payment method (Cash on Delivery).',
        'Account information, including your name, email address and password, if you create an account.',
        'Customer support information, including anything you choose to send us, for example in a message on Instagram or by email.',
      ] },
      'Some features of the Services need this information to work. You may choose not to provide it, but doing so may prevent you from using those features, for example placing an order.',
    ] },
    { heading: 'Cookies, local storage and usage data', body: [
      'When you use our site, our hosting and infrastructure providers may automatically receive technical information such as your IP address, browser and device type, and the pages you request.',
      'We use your browser’s local storage (which works like a cookie) to remember what is in your bag, keep you signed in, and remember that you have already seen our welcome message. We do not use it to track you across other websites.',
      'Our pages load fonts from Google Fonts, so your browser connects to Google’s servers to fetch them. You can clear or block local storage in your browser settings, but parts of the site (such as your bag) may then not work properly.',
    ] },
    { heading: 'Information we obtain from third parties', body: [
      'We use trusted service providers to run our Services, such as Vercel for website hosting, Supabase for our database and account sign-in, and courier partners to deliver your orders. These providers handle information on our behalf and only for the purpose of providing their services to us. Any information we obtain from them is treated in accordance with this Privacy Policy.',
    ] },
    { heading: 'How we use your personal information', body: [{ list: [
      'Providing our products and services: to process and deliver your orders, confirm them with you, manage your account, and handle exchanges or refunds.',
      'Communicating with you: to send order updates, answer your questions, and provide customer support.',
      'Security and fraud prevention: to detect, investigate, or act on possible fraudulent, illegal or malicious activity. If you create an account, you are responsible for keeping your login details safe, and you should contact us immediately if you think your account has been compromised.',
      'Marketing: if you have asked to hear from us, we may send you news about new collections. You can opt out at any time by telling us.',
      'Improving our Services, complying with legal obligations, enforcing our terms, and protecting our rights and the rights of our users or others.',
    ] }] },
    { heading: 'How we disclose personal information', body: [
      'We do not sell your personal information. We share it only where needed:',
      { list: [
        'With service providers who perform services on our behalf, such as hosting, database, and cloud storage providers.',
        'With our delivery partners, who need your name, phone number and address so your order can reach you.',
        'When you direct us to, or otherwise consent to us sharing information.',
        'To comply with the law, respond to lawful requests, enforce our terms, or protect our rights and the rights of our users or others.',
        'In connection with a business transaction such as a merger or sale of our business.',
      ] },
    ] },
    { heading: 'Third-party websites and links', body: [
      'Our site may link to websites or platforms operated by third parties, such as Instagram. If you follow links to sites we do not control, please review their privacy and security policies. We are not responsible for the privacy or security of those sites.',
    ] },
    { heading: 'Children’s data', body: [
      'The Services are not intended for children under 16, and we do not knowingly collect personal information about them. If you are a parent or guardian and believe your child has given us their personal information, please contact us and we will delete it.',
    ] },
    { heading: 'Security and retention', body: [
      'Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee perfect security. In addition, any information you send to us may not be secure while in transit. We recommend that you do not use insecure channels to communicate sensitive or confidential information to us.',
      'How long we keep your personal information depends on factors such as whether we need it to maintain your account, provide the Services, comply with legal obligations, or resolve disputes.',
    ] },
    { heading: 'Your rights', body: [
      'Depending on where you live, you may have some or all of the following rights. These rights are not absolute, may apply only in certain circumstances, and in some cases we may decline a request as permitted by law.',
      { list: [
        'Access: to ask for a copy of the personal information we hold about you.',
        'Correction: to ask us to correct inaccurate information.',
        'Deletion: to ask us to delete the personal information we hold about you.',
        'Portability: to receive your information in a portable format.',
        'Restriction: to ask us to stop or restrict how we use your information.',
        'Withdrawal of consent: where we rely on your consent, to withdraw it at any time.',
        'Communication preferences: to opt out of marketing messages at any time. We may still send you non-promotional messages about your account or orders.',
      ] },
      { contact: 'To exercise any of these rights, please contact us' },
      'We may need to verify your identity before responding. We will not discriminate against you for exercising your rights.',
    ] },
    { heading: 'Complaints', body: [
      'If you have a complaint about how we handle your personal information, please contact us first. Depending on where you live, you may also have the right to complain to your local data protection authority.',
    ] },
    { heading: 'International users', body: [
      'We are based in India, and our service providers may store and process information in other countries. By using the Services, you understand that your information may be transferred to, stored and processed in countries outside the one where you live.',
    ] },
    { heading: 'Contact', body: [
      { contact: 'Should you have any questions about our privacy practices or this Privacy Policy, please reach us' },
      'For the purposes of applicable data protection laws, ZALV, Jalandhar, Punjab, India, is the data controller of your personal information.',
    ] },
  ],
};

export const sizeTables = {
  jackets: {
    head: ['Size', 'Chest (in)', 'Chest (cm)'],
    rows: [
      ['XS', '34–36', '86–91'],
      ['S', '36–38', '91–97'],
      ['M', '38–40', '97–102'],
      ['L', '40–42', '102–107'],
      ['XL', '42–44', '107–112'],
    ],
  },
  boots: {
    head: ['Size', 'UK', 'EU', 'Foot length (cm)'],
    rows: [
      ['XS', '6', '40', '24.5–25.0'],
      ['S', '7', '41', '25.4–25.8'],
      ['M', '8', '42', '26.2–26.7'],
      ['L', '9', '43', '27.1–27.5'],
      ['XL', '10', '44', '27.9–28.3'],
    ],
  },
};

export const serviceCards = [
  { icon: 'truck', title: '48-hr dispatch', text: 'Orders ship within 48 hours' },
  { icon: 'cash', title: 'Cash on delivery', text: 'Pay when your order arrives' },
  { icon: 'exchange', title: '7-day exchange', text: 'Easy exchange after delivery' },
  { icon: 'pin', title: 'Made in Jalandhar', text: 'Designed and made locally' },
] as const;
