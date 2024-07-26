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

const generatePDF = (formValues, type, cartItems, totalAmount) => {
    const { invoiceNo, companyName, clientName, telephone, email, dueDate, discount, paymentMethod } = formValues;

    // Define current date
    const issueDate = new Date().toLocaleDateString();

    

    const itemsTable = {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
            [{ text: 'Quantity', bold: true }, { text: 'Item', bold: true}, { text: 'Serial Number', bold: true},   { text: 'INC GST Price', bold: true }, { text: 'Total', bold: true }],
            ...cartItems.map(item => [
                { text: item.quantity, border: [true, false, false, false] },
                { text: item.item, border: [false, false, false, false] }, // Left border removed
                { text: item.selectedSerialNumbers[0], border: [false, false, false, false] }, // Right border removed
                
                
                { text: `$${item.retail_price}`, border: [false, false, false, false] },
                { text: `$${item.quantity * item.retail_price}`, border: [false, false, true, false] }
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
                                    'EMAIL: service@luxtronic.com.au\n',
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

                    { text: 'Tax Invoice', style: 'header' },


                    {
                    columns: [
                        {
                            // Left column for invoice details
                            width: '*',
                            stack: [
                                
                                { text: `Invoice No: ${invoiceNo}`, style: 'invoiceDetails' },
                               
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
                                        'Account Number: 11158672'
                                        
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
                                    text: 'Terms and Conditions',
                                    bold: true,
                                    fontSize:'8',
                                    margin: [0, 10, 0, 5] // Top, Right, Bottom, Left
                                },
                                {

                                    
                                    text: [
                                        { text: 'Warranty Claims: ', bold: true },
                                        'All warranty claims must be accompanied by the ORIGINAL receipt.',
                                        { text: 'Standard Warranty:', bold: true },
                                        'All goods come with a one-year return-to-base warranty, unless specified. Refurbished products excluded.',
                                        { text: 'Refurbished Products: ', bold: true },
                                        'Warranty terms for refurbished products will be specified on the invoice.',
                                        { text: 'Payment Terms: ', bold: true },
                                        'Payments must be made in full at the time of purchase. We accept cash, credit cards, and EFT (electronic funds transfer). ALL payments must clear before dispatch.',
                                        { text: 'Returns and Exchanges: ', bold: true },
                                        '14-day return policy for unopened, unused items in original condition. Custom orders and special items are non-returnable unless defective. For change of mind or opened package, 20% restocking fee may applied. Original receipt required on all returns and exchanges.',
                                        { text: 'Liability and Indemnity:', bold: true },
                                        'Liability limited to replacement or repair of goods. No liability for consequential damages. Customers indemnify us against misuse claims.',
                                        { text: 'Product Availability: ', bold: true },
                                        'All products are subject to availability. We reserve the right to limit quantities or discontinue products without notice.',
                                        { text: 'Customer Service: ', bold: true },
                                        'Contact customer service via email or phone during business hours. We will respond within 48 hours.',
                                        { text: 'For further terms and conditions please visit ', bold: false },
                                        { text: 'https://luxtronic.com.au/legal-stuff/', bold: false, link: 'https://luxtronic.com.au/legal-stuff/', decoration: 'underline' }
                                    
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

export default generatePDF;