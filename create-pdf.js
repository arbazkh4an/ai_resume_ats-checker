const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('test-resume.pdf'));

doc.fontSize(25).text('John Doe', 100, 100);
doc.fontSize(16).text('Senior Software Engineer', 100, 130);
doc.fontSize(12).text('\nExperience:\n- Built robust Next.js applications\n- Proficient in React, Node.js, and TailwindCSS\n- Managed CI/CD pipelines.\n\nEducation:\n- BS in Computer Science, State University\n\nSkills:\nJavaScript, TypeScript, React, Next.js, AI Integration.', 100, 160);

doc.end();
console.log('PDF created!');
