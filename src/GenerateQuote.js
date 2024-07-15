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
    const { invoiceNo, companyName, name, telephone, email, dueDate, discount, paymentMethod } = formValues;

    // Define current date
    const issueDate = new Date().toLocaleDateString();

    const itemsTable = {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
            [{ text: 'Serial Number', bold: true }, { text: 'Item', bold: true }, { text: 'Quantity', bold: true }, { text: 'Price', bold: true }, { text: 'Total', bold: true }],
            ...cartItems.map(item => [
                item.selectedSerialNumbers[0], // Assuming each item has only one serial number
                item.item,
                item.quantity,
                `$${item.retail_price}`,
                `$${item.quantity * item.retail_price}`
            ]),
            [{ text: 'Total Amount:', colSpan: 4, alignment: 'right', bold: true }, {}, {}, {}, { text: `$${Number(totalAmount) + Number(discount)}`, alignment: 'left', bold: true }],
            [{ text: 'Discount:', colSpan: 4, alignment: 'right', bold: true }, {}, {}, {}, `$${discount}`],
            [{ text: 'Amount Due:', colSpan: 4, alignment: 'right', bold: true }, {}, {}, {}, { text: `$${totalAmount}`, alignment: 'left', bold: true, fillColor: '#FFFF00' }],
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
            fontSize: 10,
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
                    { text: `Order No: ${invoiceNo}`, style: 'invoiceDetails' },
                    { text: `Company Name: ${companyName}`, style: 'invoiceDetails' },
                    { text: `Name: ${name}`, style: 'invoiceDetails' },
                    { text: `Telephone: ${telephone}`, style: 'invoiceDetails' },
                    { text: `Email: ${email}`, style: 'invoiceDetails' },
                    { text: 'Purchased Items', style: 'subheader' },
                    { table: itemsTable, margin: [0, 10, 0, 10] },
                    { text: 'Terms and Conditions', style: 'subheader' },
                    { text: 'The warranty of refurbished product will specify on invoice, otherwise,\nFor further warranty terms and conditions are subject to manufacturer\'s policy.', style: 'terms' }
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