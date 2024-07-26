import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import loginImg from './Pictures_/thumbnail_NEW_LOGO_DESIGN_PNG.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Function to convert image file to data URL
const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = reject;
        img.src = imgUrl;
    });
};

const generateQuote = (formValues, type, cartItems, totalAmount) => {
    const { invoiceNo, companyName, clientName, telephone, email, dueDate, discount, paymentMethod } = formValues;

    // Define current date
    const issueDate = new Date().toLocaleDateString();

    const itemsTable = {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
            [{ text: 'Quantity', bold: true },{ text: 'Item', bold: true }, { text: 'Serial Number', bold: true },  { text: 'INC GST Price', bold: true }, { text: 'Total', bold: true }],
            ...cartItems.map(item => [
                { text: item.quantity, border: [true, false, false, false] },
                { text: item.item, border: [false, false, false, false] }, // Left border removed
                { text: item.selectedSerialNumbers[0], border: [false, false, false, false] }, // Right border removed
                
                
                { text: `$${item.retail_price}`, border: [true, true, true, true] },
                { text: `$${item.quantity * item.retail_price}`, border: [true, true, true, true] }
            ]),
            [{ text: 'Discount:', colSpan: 4, alignment: 'right', bold: true, border: [false, true, false, false] }, {}, {}, {}, `$${discount}`],
            [{ text: 'GST:', colSpan: 4, alignment: 'right', bold: true, border: [false, false, false, false] }, {}, {}, {}, { text: `$${(Number(totalAmount)* 0.10)}`, alignment: 'left', bold: true }],
            [{ text: 'Total Amount INC GST:', colSpan: 4, alignment: 'right', bold: true, border: [false, false, false, false] }, {}, {}, {}, { text: `$${Number(totalAmount) + Number(discount)}`, alignment: 'left', bold: true }],
            [{ text: 'Amount Due:', colSpan: 4, alignment: 'right', bold: true, border: [false, false, false, false] }, {}, {}, {}, { text: `$${totalAmount}`, alignment: 'left', bold: true, fillColor: '#FFFF00' }],
        ]
    };
    

    // Define styles for the PDF
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
            alignment: 'center'
        },
        subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: 'center'
        },
        logo: {
            width: 80,
            margin: [0, 5, 5, 10], // Adjust margins as needed
            alignment: 'left'
        },
        companyInfo: {
            fontSize: 7,
            margin: [15, 10, 10, 10], // Adjust margins as needed
            alignment: 'left'
        },
        invoiceDetails: {
            fontSize: 12,
            margin: [0, 0, 0, 0],
            alignment: 'left'
        },
        terms: {
            fontSize: 10,
            italics: true,
            margin: [0, 10, 0, 5]
        }
    };

    getBase64Image(loginImg)
        .then(logoDataUrl => {
            // Define the document definition
            const docDefinition = {
                content: [
                    {
                        columns: [
                            { image: logoDataUrl, width: 80, style: 'logo' }, // Add the company logo
                            {
                                text: [
                                    { text: 'LUXTRONIC PTY LTD\n', bold: true, fontSize: 14 },
                                    { text: 'A.B.N: 46 622 077 169\n', bold: true, fontSize: 12 },
                                    'Shop T15, Level 1, Capitol Square\n',
                                    '730-742 George Street HAYMARKET NSW 2000 Australia\n',
                                    'WWW.LUXTRONIC.COM.AU\n',
                                    'EMAIL: luxtronic@outlook.com.au\n',
                                    'PH: 0406 868 891'
                                ],
                                style: 'companyInfo'
                            },
                            {
                                text: [
                                    { text: `Date of Issue: ${issueDate}\n`, alignment: 'right' },
                                    { text: `Due Date: ${new Date(dueDate).toLocaleDateString()}\n`, alignment: 'right' }
                                ],
                                style: 'invoiceDetails'
                            }
                        ]
                    },
                    { text: 'Quote', style: 'header' },

                    {
                        columns: [
                            {
                                // Left column for invoice details
                                width: '*',
                                stack: [
                                    
                                    { text: `Order No: ${invoiceNo}`, style: 'invoiceDetails' },
                                   
                                    { text: `Name: ${clientName}`, style: 'invoiceDetails' },
                                    { text: `Telephone: ${telephone}`, style: 'invoiceDetails' },
                                    { text: `Email: ${email}`, style: 'invoiceDetails' },
                                    
                                ]
                            },
                            {
                                // Right column for banking details
                                width: 'auto',
                                stack: [
                                    {
                                        text: [
                                           
                                            
                                            'For Bank Transfer: Commonwealth Bank Australia\n',
                                            'Account Name: Luxtronic\n',
                                            'BSB: 062010\n',
                                            'Account Number: 11158672',
                                            
                                        ],
                                        style: 'invoiceDetails',
                                        alignment: 'right'
                                    }
                                ]
                            }
                        ]
                    },
    
               
                    
                 
                    { text: 'Purchased Items', style: 'subheader' },
                    { table: itemsTable, margin: [0, 10, 0, 10] },
                   
                    {  columns: [
                        { width: '*', text: '' }, // Empty column for left side
                        {
                            width: '100%',
                            stack: [
                                {
                                    text: 'Quotation Terms and Conditions',
                                    bold: true,
                                    fontSize:'8',
                                    margin: [0, 10, 0, 5] // Top, Right, Bottom, Left
                                },
                                {

                                    
                                    text: [
                                        { text: 'Validity: ', bold: true },
                                        'This quotation is valid for 30 days from the date of issue unless otherwise stated.',
                                        { text: 'Acceptance:', bold: true },
                                        'Acceptance of this quotation must be confirmed in writing. Any modifications to the quoted terms must be mutually agreed upon in writing.',
                                        { text: 'Pricing: ', bold: true },
                                        'All prices quoted are in AUD and are exclusive of GST unless otherwise stated. Prices are subject to change without notice until a formal purchase order is received.',
                                        { text: 'Payment Terms: ', bold: true },
                                        'Payments must be made in full according to the terms specified in the quotation. We accept cash, credit cards, and EFT. EFT payments must clear before dispatch of goods.',
                                        { text: 'Product Availability: ', bold: true },
                                        'All products are subject to availability. We reserve the right to limit quantities or discontinue products without notice.',
                                        { text: 'Delivery: ', bold: true },
                                        'Delivery times are estimates and not guaranteed. We are not liable for any delays. Delivery costs will be borne by the purchaser unless otherwise agreed.',
                                        { text: 'Returns and Exchanges: ', bold: true },
                                        'Products can be returned or exchanged only as per the conditions outlined in our standard return policy. Custom orders and special items are non-returnable unless defective. All returns must be accompanied by the original receipt.',
                                        { text: 'Warranty Claims: ', bold: true },
                                        'Warranty claims must be accompanied by the original receipt. All goods come with a one-year return-to-base warranty, unless specified. Refurbished products are excluded unless otherwise stated on the invoice.',
                                        { text: 'Liability and Indemnity:', bold: true },
                                        'Our liability for any defect or failure of the goods or services supplied is limited to the replacement or repair of the goods. We shall not be liable for any consequential or incidental damages, including but not limited to loss of profits or data. Customers agree to indemnify us against any claims arising from the misuse of the products purchased.',
                                       
                                        { text: 'Customer Service: ', bold: true },
                                        'For any enquiries or support, customers can contact our customer service team via email or phone during business hours. We strive to respond to all enquiries within 48 hours.',
                                        { text: 'Privacy Policy: ', bold: true },
                                        'We respect your privacy and are committed to protecting your personal information. Your details will not be shared with third parties without your consent, except as required by law.',
                                        { text: 'Governing Law: ', bold: true },
                                        'These terms and conditions are governed by and construed in accordance with the laws of New South Wales (NSW), Australia.',
                                    
                            ],
                            alignment: 'left',
                            fontSize: '6'
                        }
                    ]
                }
            ]

        }
                ],
                styles: styles,
                pageSize: 'A4',
                pageOrientation: 'landscape'
            };

            // Create PDF and download
            pdfMake.createPdf(docDefinition).download(`${type}_${invoiceNo}.pdf`);
        })
        .catch(error => {
            console.error('Error loading image:', error);
        });
};

export default generateQuote;