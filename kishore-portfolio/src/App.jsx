import React, { useEffect, useState } from 'react';

const DEFAULT_PASSWORD = "Portfolio@1911";
const STORAGE_KEY = "kishore_portfolio_data_v1";

const defaultData = {
  name: "Kishore Kumar",
  email: "kishorekampalli432001@gmail.com",
  tagline: "iOS & Full Stack Engineer",
  linkedin: "https://www.linkedin.com/",
  resumeLink: "",
  about: "Hello! I build mobile apps and web products. Replace this text with your own bio.",
  skills: ["Swift", "SwiftUI", "React", "Node.js"],
  education: [
    { institution: "Example University", degree: "B.Tech - CSE", year: "2020", image: "", description: "Studied Computer Science." }
  ],
  experience: [
    { company: "Fintech Startup (Example)", role: "Software Engineer", period: "2021 - Present", description: "Worked on payments and mobile apps." }
  ],
  projects: [
    { title: "Sample Project", description: "A short description.", pdfLink: "", thumbnail: "" }
  ]
};

function usePortfolioData() {
  const [data, setData] = useState(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : defaultData; } catch (e) { return defaultData; }
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error(e); } }, [data]);
  return [data, setData];
}

export default function App() {
  const [data, setData] = usePortfolioData();
  const [editing, setEditing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [passAttempt, setPassAttempt] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { if (sessionStorage.getItem('kishore_logged_in') === '1') { setLoggedIn(true); setEditing(true);} }, []);

  function login() { if (passAttempt === DEFAULT_PASSWORD) { setLoggedIn(true); sessionStorage.setItem('kishore_logged_in','1'); setEditing(true); setShowModal(false);} else { alert('Wrong password'); } setPassAttempt(''); }
  function logout() { setLoggedIn(false); setEditing(false); sessionStorage.removeItem('kishore_logged_in'); }

  function updateField(path, value) {
    const copy = JSON.parse(JSON.stringify(data));
    let cur = copy;
    for (let i=0;i<path.length-1;i++) cur = cur[path[i]];
    cur[path[path.length-1]] = value;
    setData(copy);
  }
  function addItem(section) {
    const copy = JSON.parse(JSON.stringify(data));
    if (section === 'projects') copy.projects.push({ title: 'New Project', description:'', pdfLink:'', thumbnail:'' });
    if (section === 'education') copy.education.push({ institution:'New School', degree:'', year:'', image:'', description:'' });
    if (section === 'experience') copy.experience.push({ company:'New Company', role:'', period:'', description:'' });
    if (section === 'skills') copy.skills.push('New Skill');
    setData(copy);
  }
  function removeItem(section, idx) { const copy = JSON.parse(JSON.stringify(data)); copy[section].splice(idx,1); setData(copy); }

  const sectionCard = "bg-gradient-to-br from-gray-900 via-black to-gray-900/80 border border-gray-800 p-6 rounded-2xl shadow-lg";

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-5xl mx-auto p-6 text-white">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{data.name}</h1>
            <p className="text-sm opacity-80">{data.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={data.linkedin} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-pink-400 text-pink-300">LinkedIn</a>
            <a href={data.resumeLink || '#'} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-yellow-400 text-yellow-300">Resume</a>
            {!loggedIn ? (<button onClick={()=> setShowModal(true)} className="px-3 py-2 rounded-lg border border-white/20">Manage</button>) : (<><button onClick={()=> setEditing(!editing)} className="px-3 py-2 rounded-lg border border-white/20">{editing ? 'Exit Editor' : 'Edit'}</button><button onClick={logout} className="px-3 py-2 rounded-lg border border-white/20">Logout</button></>)}
          </div>
        </header>

        <section className={`${sectionCard} mb-6`}>
          <div className="flex gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">About</h2>
              {editing ? (<textarea className="w-full bg-transparent border border-gray-800 p-3 rounded" value={data.about} onChange={(e)=> updateField(['about'], e.target.value)} />) : (<p className="opacity-90">{data.about}</p>)}
            </div>
            <div className="w-48 flex-shrink-0">
              <div className="h-36 w-36 bg-pink-900 rounded-xl flex items-center justify-center text-white">Profile</div>
              <p className="text-xs opacity-70 mt-2">Email: <a href={`mailto:${data.email}`} className="text-pink-300">{data.email}</a></p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className={`${sectionCard}`}>
            <h3 className="font-bold mb-3">Skills</h3>
            {editing ? (<div>{data.skills.map((s,i)=>(<div key={i} className="flex items-center gap-2 mb-2"><input className="flex-1 bg-transparent border border-gray-800 p-2 rounded" value={s} onChange={(e)=> updateField(['skills', i], e.target.value)} /><button onClick={()=> { const copy = JSON.parse(JSON.stringify(data)); copy.skills.splice(i,1); setData(copy); }} className="px-2 py-1 text-sm rounded bg-red-600">Del</button></div>))}<button onClick={()=> addItem('skills')} className="mt-2 px-3 py-2 rounded bg-green-600">Add Skill</button></div>) : (<div className="flex flex-wrap gap-2">{data.skills.map((s,i)=>(<span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">{s}</span>))}</div>)}
          </div>
          <div className={`${sectionCard} md:col-span-2`}>
            <h3 className="font-bold mb-3">Contact</h3>
            <p className="mb-3">Want to work together? Send an email or use the contact form.</p>
            <a className="inline-block mb-3" href={`mailto:${data.email}?subject=Hey%20Kishore`}>Email: {data.email}</a>
            <form onSubmit={(e)=> { e.preventDefault(); const form = e.target; const subject = encodeURIComponent(form.subject.value); const body = encodeURIComponent(form.message.value + "\n\nFrom: " + form.email.value); window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`; }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input name="email" placeholder="Your email" className="col-span-1 p-2 bg-transparent border border-gray-800 rounded" />
                <input name="subject" placeholder="Subject" className="col-span-2 p-2 bg-transparent border border-gray-800 rounded" />
                <textarea name="message" placeholder="Message" className="col-span-3 p-2 bg-transparent border border-gray-800 rounded" style={{height:120}}></textarea>
              </div>
              <div className="mt-3"><button type="submit" className="px-4 py-2 rounded bg-pink-600">Send (opens mail client)</button></div>
            </form>
          </div>
        </div>

        <section className={`${sectionCard} mb-6`}>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Education</h2>{editing && <button onClick={()=> addItem('education')} className="px-3 py-2 rounded bg-green-600">Add</button>}</div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">{data.education.map((ed, idx)=>(<div key={idx} className="p-4 border border-gray-800 rounded-lg flex items-center gap-4"><div className="w-24 h-24 bg-white/5 rounded overflow-hidden flex items-center justify-center">{ed.image ? <img src={ed.image} alt={ed.institution} className="object-cover w-full h-full" /> : <div className="text-xs opacity-60">No image</div>}</div><div className="flex-1">{editing ? (<><input className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" value={ed.institution} onChange={(e)=> updateField(['education', idx, 'institution'], e.target.value)} /><input className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" value={ed.degree} onChange={(e)=> updateField(['education', idx, 'degree'], e.target.value)} /><input className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" value={ed.year} onChange={(e)=> updateField(['education', idx, 'year'], e.target.value)} /><input className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" value={ed.image} onChange={(e)=> updateField(['education', idx, 'image'], e.target.value)} placeholder="Public image URL for college" /><textarea className="w-full bg-transparent border border-gray-800 p-2 rounded" value={ed.description} onChange={(e)=> updateField(['education', idx, 'description'], e.target.value)} /><div className="mt-2"><button onClick={()=> removeItem('education', idx)} className="px-2 py-1 rounded bg-red-600">Remove</button></div></>) : (<><h4 className="font-semibold">{ed.institution} — {ed.degree}</h4><p className="text-sm opacity-80">{ed.year}</p><p className="mt-2 opacity-90">{ed.description}</p></>)}</div></div>))}</div>
        </section>

        <section className={`${sectionCard} mb-6`}>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Projects</h2>{editing && <button onClick={()=> addItem('projects')} className="px-3 py-2 rounded bg-green-600">Add Project</button>}</div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">{data.projects.map((p, idx)=>(<div key={idx} className="p-4 border border-gray-800 rounded-lg bg-gradient-to-r from-black/30 via-pink-900/10 to-black"><div className="flex gap-4"><div className="w-24 h-24 bg-white/5 rounded overflow-hidden flex items-center justify-center">{p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="object-cover w-full h-full" /> : <div className="text-xs opacity-60">No image</div>}</div><div className="flex-1">{editing ? (<><input value={p.title} onChange={(e)=> updateField(['projects', idx, 'title'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" /><input value={p.pdfLink} onChange={(e)=> updateField(['projects', idx, 'pdfLink'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" placeholder="Link to PDF (Google Drive public link)" /><input value={p.thumbnail} onChange={(e)=> updateField(['projects', idx, 'thumbnail'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" placeholder="Thumbnail URL (optional)" /><textarea value={p.description} onChange={(e)=> updateField(['projects', idx, 'description'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" /><div><button onClick={()=> removeItem('projects', idx)} className="px-2 py-1 rounded bg-red-600">Remove</button></div></>) : (<><h3 className="font-semibold text-lg">{p.title}</h3><p className="text-sm opacity-80">{p.description}</p><div className="mt-2 flex gap-2">{p.pdfLink ? (<a href={p.pdfLink} target="_blank" rel="noreferrer" className="px-3 py-2 rounded border border-yellow-400">View PDF</a>) : (<span className="text-xs opacity-60">No PDF link</span>)}</div></>)}</div></div></div>))}</div>
        </section>

        <section className={`${sectionCard} mb-6`}>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Work Experience</h2>{editing && <button onClick={()=> addItem('experience')} className="px-3 py-2 rounded bg-green-600">Add</button>}</div>
          <div className="mt-4 space-y-3">{data.experience.map((ex, idx)=>(<div key={idx} className="p-3 border border-gray-800 rounded-lg">{editing ? (<><input value={ex.company} onChange={(e)=> updateField(['experience', idx, 'company'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" /><input value={ex.role} onChange={(e)=> updateField(['experience', idx, 'role'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" /><input value={ex.period} onChange={(e)=> updateField(['experience', idx, 'period'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded mb-2" /><textarea value={ex.description} onChange={(e)=> updateField(['experience', idx, 'description'], e.target.value)} className="w-full bg-transparent border border-gray-800 p-2 rounded" /><div className="mt-2"><button onClick={()=> removeItem('experience', idx)} className="px-2 py-1 rounded bg-red-600">Remove</button></div></>) : (<><div className="flex justify-between"><h3 className="font-semibold">{ex.company} — {ex.role}</h3><span className="text-sm opacity-70">{ex.period}</span></div><p className="mt-2 opacity-90">{ex.description}</p></>)}</div>))}</div>
        </section>

        {showModal && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"><div className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl w-full max-w-2xl"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Manage Site</h3><button onClick={()=> setShowModal(false)} className="px-3 py-1 rounded border">Close</button></div><div>{!loggedIn ? (<div><p className="mb-2">Enter password to edit your site (client-side auth).</p><input type="password" value={passAttempt} onChange={(e)=> setPassAttempt(e.target.value)} className="w-full p-2 bg-transparent border border-gray-800 rounded mb-3" /><div className="flex gap-2"><button onClick={login} className="px-4 py-2 rounded bg-pink-600">Login</button></div><p className="text-xs opacity-60 mt-3">Note: password and data are stored only on your device (localStorage/sessionStorage). This method is not secure for sensitive data.</p></div>) : (<div><p className="mb-2">You are logged in. Use the editor on the main page to change content.</p><div className="flex gap-2"><button onClick={()=> { localStorage.removeItem(STORAGE_KEY); setData(defaultData); alert('Reset to defaults'); }} className="px-4 py-2 rounded bg-red-600">Reset Data</button></div></div>)}</div></div></div>)}

        <footer className="mt-8 text-center opacity-60 text-sm">Built with a vibrant dark theme • Edit locally with password-protected editor (client-side).</footer>
      </div>
    </div>
  );
}
