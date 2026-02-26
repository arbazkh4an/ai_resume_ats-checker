import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const jobDescription =
      (formData.get("jobDescription") as string) ||
      "General software engineering role";

    if (!file) {
      return NextResponse.json({ error: "Resume PDF is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await extractText(new Uint8Array(arrayBuffer));
    const resumeText = Array.isArray(result.text) ? result.text.join("\n") : String(result.text || "");

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "arcee-ai/trinity-large-preview:free",
        messages: [
          {
            role: "system",
            content: "You are a world-class ATS (Applicant Tracking System) expert and senior technical recruiter. You provide highly detailed, structured, and constructive analysis of resumes against job descriptions. You always respond with valid JSON only, no markdown."
          },
          {
            role: "user",
            content: `Perform a comprehensive deep-dive analysis of this resume against the job description. Return ONLY a valid JSON object with the following structure:
{
  "score": number (0-100),
  "summary": "a 2-3 sentence overview of the candidate's profile",
  "skills": {
    "matched": ["list of skills found in both"],
    "missing": ["critical skills from JD not found in resume"],
    "bonus": ["valuable skills in resume not explicitly in JD"]
  },
  "experience_analysis": "detailed evaluation of their work history relevance",
  "education_analysis": "evaluation of education and certifications",
  "format_feedback": "detailed advice on resume layout and structural improvements",
  "action_items": [
    "specific, actionable step to improve the resume or profile",
    "another specific step",
    "..."
  ],
  "keywordMatches": ["all relevant keywords matched"],
  "missingKeywords": ["important keywords to consider adding"],
  "feedback": "overall high-level advice"
}

Job Description: ${jobDescription}

Resume Text:
${resumeText.substring(0, 6000)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("OpenRouter error:", errBody);
      return NextResponse.json({ error: "AI API error: " + response.status }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonString = content.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON", rawResponse: jsonString }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("ATS Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
