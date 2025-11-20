import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, TabStopPosition } from "docx";
import { ResumeData } from "../types";

export const generateDocx = async (data: ResumeData): Promise<Blob> => {
  // Helper to create a section heading
  const createHeading = (text: string) => {
    return new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      border: {
        bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
      },
      spacing: { after: 200, before: 200 },
    });
  };

  // Helper for bullet points
  const createBullet = (text: string) => {
    return new Paragraph({
      text: text,
      bullet: { level: 0 },
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Name
          new Paragraph({
            text: data.personal.fullName,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),

          // Contact Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${data.personal.email} | ${data.personal.phone}`),
              data.personal.location ? new TextRun(` | ${data.personal.location}`) : new TextRun(""),
              data.personal.linkedin ? new TextRun(` | ${data.personal.linkedin}`) : new TextRun(""),
              data.personal.github ? new TextRun(` | ${data.personal.github}`) : new TextRun(""),
            ],
            spacing: { after: 400 },
          }),

          // Summary
          ...(data.personal.summary ? [
            createHeading("Professional Summary"),
            new Paragraph({
              text: data.personal.summary,
              spacing: { after: 300 },
            }),
          ] : []),

          // Experience
          createHeading("Experience"),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true, size: 24 }),
                new TextRun({ 
                    text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                    bold: true,
                }),
              ],
              tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
              ],
            }),
            new Paragraph({
              text: exp.company,
              italics: true,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: exp.description,
              spacing: { after: 300 },
            }),
          ]),

          // Projects
          ...(data.projects.length > 0 ? [
            createHeading("Projects"),
            ...data.projects.flatMap((proj) => [
              new Paragraph({
                children: [
                  new TextRun({ text: proj.name, bold: true }),
                  ...(proj.link ? [new TextRun({ text: ` (${proj.link})`, color: "0000FF" })] : []),
                ],
              }),
              new Paragraph({
                text: proj.description,
                spacing: { after: 200 },
              }),
            ]),
          ] : []),

          // Education
          createHeading("Education"),
          ...data.education.flatMap((edu) => [
             new Paragraph({
              children: [
                new TextRun({ text: edu.school, bold: true }),
                new TextRun({ 
                    text: `\t${edu.year}`,
                    bold: true,
                }),
              ],
              tabStops: [
                  { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
              ],
            }),
            new Paragraph({
              text: edu.degree,
              spacing: { after: 200 },
            }),
          ]),

          // Skills
          createHeading("Skills"),
          new Paragraph({
            text: data.skills.join(" • "),
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};