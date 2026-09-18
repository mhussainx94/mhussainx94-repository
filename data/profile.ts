import type { Profile } from "@/types";

/**
 * Edit this file to update the hero card, the terminal "whoami" reveal,
 * and the About section. Nothing else in the codebase hardcodes this
 * content.
 *
 * `photoUrl` is left undefined on purpose — there's no photo on file.
 * Drop an image into /public (e.g. /public/avatar.jpg) and set
 * photoUrl: "/avatar.jpg" to replace the monogram avatar on the card.
 *
 * `cvUrl` works the same way for the CV-download terminal between
 * About and Education: drop the PDF into /public (e.g.
 * /public/Muhammad-Hussain-CV.pdf) and set cvUrl to match. Left
 * undefined until a real CV is added — the terminal shows an honest
 * "not found yet" message instead of a broken download in the meantime.
 */
export const profile: Profile = {
  name: "Hussain",
  handle: "mhussainx94",
  title: "Cybersecurity & Penetration Testing",
  location: "Islamabad, Pakistan",
  summary: "BS Computer Science @ NUTECH — building toward offensive security",
  photoUrl: "/image.png",
  cvUrl: "/mhussainx94-cv.pdf",
  bio: [
  "I'm a Computer Science student and cybersecurity practitioner focused on penetration testing, vulnerability assessment, web application security, and API security.",
"My security mindset is simple: understand the system, find the weakness, validate the risk, and help fix it. I work with tools such as Burp Suite, OWASP ZAP, Kali Linux, Python, Linux, and Git while developing my skills through hands-on labs, security research, and practical projects.",
"I gained professional software-security experience through the Software Screening & Lab Directorate at National CERT, working with Secure SDLC concepts, application security assessment, vulnerability identification, security testing, and remediation. I'm currently building toward a career in offensive security and penetration testing."
  ],
};
