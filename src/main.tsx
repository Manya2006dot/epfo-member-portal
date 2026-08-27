import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Home, Map, WalletCards, FileText, Landmark, CircleHelp, Bot, Bell, LogOut, ChevronRight, Download, ShieldCheck, Users, IndianRupee, X, Plus, CheckCircle2 } from 'lucide-react';
import './styles.css';

const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
type Data={user:any;contributions:any[];claims:any[];nominees:any[];totals:{employee:number;employer:number;total:number}};
const money=(n:number)=>`₹ ${n.toLocaleString('en-IN')}`;
async function request(path:string,options:RequestInit={},token?:string){const r=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});const d=r.status===204?null:await r.json();if(!r.ok)throw new Error(d.error||'Request failed');return d}

function Logo(){return <div className="logo"><span>✺</span><div><b>EPFO</b><small>Employees' Provident<br/>Fund Organisation</small></div></div>}
const nav: [string, any][]=[['Overview',Home],['My Journey',Map],['My PF',WalletCards],['Passbook',FileText],['Claims',Landmark],['Help & Support',CircleHelp]];
function Sidebar({page,setPage,logout}:{page:string;setPage:(p:string)=>void;logout:()=>void}){return <aside><Logo/><nav>{nav.map(([label,Icon])=><button key={label} className={page===label?'active':''} onClick={()=>setPage(label)}><Icon size={16}/>{label}</button>)}</nav><div className="aside-bottom"><button onClick={()=>setPage('Help & Support')}><Bot size={16}/>Ask EPFO AI</button><button onClick={logout}><LogOut size={16}/>Sign out</button></div></aside>}
function Header({title,user}:{title:string;user:any}){return <header><div><p className="crumb">Home <ChevronRight size={12}/> {title}</p><h1>{title}</h1></div><div className="header-actions"><select aria-label="Language"><option>English</option><option>Hindi</option></select><button className="avatar" title="Member profile">{user.fullName.split(' ').map((x:string)=>x[0]).slice(0,2).join('')}</button></div></header>}
function Modal({title,children,onClose}:{title:string;children:any;onClose:()=>void}){return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-label={title}><button className="close" onClick={onClose}><X/></button><h2>{title}</h2>{children}</section></div>}
function Overview({data,setPage}:{data:Data;setPage:(p:string)=>void}){const cards=[['Total Balance',data.totals.total,WalletCards],['Employee Share',data.totals.employee,Users],['Employer Share',data.totals.employer,Landmark],['Total Contribution',data.contributions.length*6500,IndianRupee]];return <><div className="split-title"><div><h2>My PF Overview</h2><p>Here’s your Provident Fund summary</p></div><button className="outline"><Download size={15}/>Download Passbook</button></div><div className="stats">{cards.map(([label,value,Icon]:any)=><article className="stat" key={label}><span className="icon"><Icon size={18}/></span><p>{label} <i>ⓘ</i></p><strong>{money(value)}</strong><small>{label==='Total Balance'?'As on 25 May 2026':'FY 2025–26'}</small></article>)}</div><div className="dashboard-grid"><article className="panel"><h3>Recent Contribution</h3>{data.contributions.slice(0,2).map(c=><div className="contribution" key={c.id}><div><b>{new Date(c.month).toLocaleString('en-IN',{month:'short',year:'numeric'})}</b><small>Employee: {money(c.employeeShare)} · Employer: {money(c.employerShare)}</small></div><strong>{money(c.employeeShare+c.employerShare)}</strong></div>)}<button className="link" onClick={()=>setPage('Passbook')}>View Passbook <ChevronRight size={15}/></button></article><article className="panel"><h3>Quick Links</h3>{['Check Claim Status','Update KYC','Add / Update Nominee','Track UAN Transfer','Download UAN Card'].map((x,i)=><button className="quick" key={x} onClick={()=>setPage(i===0?'Claims':i===2?'My PF':'Help & Support')}>{x}<ChevronRight size={15}/></button>)}</article></div><div className="secure"><ShieldCheck/>Stay informed, stay secure! <span>Keep your KYC and nominee details updated to avoid any interruption in services.</span></div></>}
function Passbook({data}:{data:Data}){return <><div className="split-title"><div><h2>Passbook / Contributions</h2><p>Track your contributions and balance</p></div><button className="outline"><Download size={15}/>Download</button></div><div className="balance"><div><small>Opening Balance</small><b>{money(167650)}</b></div><div><small>Total Employee Share</small><b>{money(data.totals.employee)}</b></div><div><small>Total Employer Share</small><b>{money(data.totals.employer)}</b></div><div><small>Closing Balance</small><b>{money(167650+data.totals.total)}</b></div></div><div className="table-wrap"><table><thead><tr><th>Month</th><th>Employee Share (₹)</th><th>Employer Share (₹)</th><th>Pension Share (₹)</th><th>Total (₹)</th><th>Status</th></tr></thead><tbody>{data.contributions.map(c=><tr key={c.id}><td>{new Date(c.month).toLocaleString('en-IN',{month:'long',year:'numeric'})}</td><td>{c.employeeShare.toLocaleString()}</td><td>{c.employerShare.toLocaleString()}</td><td>{c.pensionShare.toLocaleString()}</td><td>{(c.employeeShare+c.employerShare+c.pensionShare).toLocaleString()}</td><td><em>Credited</em></td></tr>)}</tbody></table></div><div className="note"><ShieldCheck/>Contribution may take up to 7 days to reflect in your passbook.</div></>}
function MyPF({data,onUpdate}:{data:Data;onUpdate:()=>void}){return <><div className="split-title"><div><h2>UAN Details</h2><p>Your Universal Account Number (UAN) information</p></div></div><div className="two-col"><article className="panel profile"><h3>Your UAN</h3><strong>{data.user.uan}</strong><em>● Active</em><hr/><small>Member ID</small><b>{data.user.memberId}</b><small>Date of Allotment</small><b>12 Jan 2023</b><small>Mobile Number</small><b>{data.user.mobile} <em>✓ Verified</em></b><small>Email ID</small><b>{data.user.email} <em>✓ Verified</em></b></article><article className="panel"><h3>What can you do?</h3>{['Use this UAN for all EPF services','Need to create a new UAN when you change jobs','Keep your KYC details updated','View or download your PF account passbook'].map(x=><p className="tick" key={x}>✓ {x}</p>)}<button className="outline" onClick={onUpdate}>Update KYC Details <ChevronRight size={15}/></button></article></div><div className="note"><ShieldCheck/>Never share your UAN or personal details with anyone.</div></>}
function Claims({data,token,reload,toast}:{data:Data;token:string;reload:()=>void;toast:(x:string)=>void}){const [show,setShow]=useState(false);const submit=async(e:any)=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await request('/claims',{method:'POST',body:JSON.stringify({type:f.get('type'),amount:Number(f.get('amount'))})},token);setShow(false);toast('Claim submitted successfully.');reload()}catch(e:any){toast(e.message)}};return <><div className="split-title"><div><h2>Claims</h2><p>Track and manage your claims</p></div><button className="primary" onClick={()=>setShow(true)}><Plus size={15}/>Apply for Claim</button></div><div className="table-wrap"><table><thead><tr><th>Claim ID</th><th>Claim Type</th><th>Date of Claim</th><th>Status</th><th>Amount (₹)</th><th></th></tr></thead><tbody>{data.claims.map(c=><tr key={c.id}><td>{c.claimNumber}</td><td>{c.type}</td><td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td><td><em className={c.status==='Settled'?'':'amber'}>{c.status}</em></td><td>{c.amount.toLocaleString()}</td><td><button className="link">View</button></td></tr>)}</tbody></table></div>{show&&<Modal title="Apply for a claim" onClose={()=>setShow(false)}><form onSubmit={submit}><label>Claim type<select name="type"><option>PF Withdrawal</option><option>PF Advance</option></select></label><label>Amount (₹)<input name="amount" type="number" min="1" required placeholder="e.g. 15000"/></label><button className="primary wide">Submit claim</button></form></Modal>}</>}
function Nominees({data,token,reload,toast}:{data:Data;token:string;reload:()=>void;toast:(x:string)=>void}){const [show,setShow]=useState(false);const add=async(e:any)=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await request('/nominees',{method:'POST',body:JSON.stringify({name:f.get('name'),relationship:f.get('relationship'),dob:f.get('dob'),share:Number(f.get('share'))})},token);setShow(false);toast('Nominee added.');reload()}catch(e:any){toast(e.message)}};const remove=async(id:string)=>{try{await request('/nominees/'+id,{method:'DELETE'},token);toast('Nominee removed.');reload()}catch(e:any){toast(e.message)}};return <><div className="split-title"><div><h2>Nominee Details</h2><p>Secure your EPF benefits for your family</p></div><button className="primary" onClick={()=>setShow(true)}><Plus size={15}/>Add Nominee</button></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Relationship</th><th>Date of Birth</th><th>Share (%)</th><th>Status</th><th></th></tr></thead><tbody>{data.nominees.map(n=><tr key={n.id}><td>{n.name}</td><td>{n.relationship}</td><td>{new Date(n.dob).toLocaleDateString('en-IN')}</td><td>{n.share}%</td><td><em>Active</em></td><td><button aria-label="Delete nominee" className="delete" onClick={()=>remove(n.id)}>×</button></td></tr>)}</tbody></table></div>{show&&<Modal title="Add nominee" onClose={()=>setShow(false)}><form onSubmit={add}><label>Full name<input name="name" required/></label><label>Relationship<input name="relationship" required placeholder="e.g. Spouse"/></label><label>Date of birth<input name="dob" type="date" required/></label><label>Share (%)<input name="share" type="number" min="1" max="100" required/></label><button className="primary wide">Add nominee</button></form></Modal>}</>}
function Help(){return <><div className="split-title"><div><h2>How can we help you?</h2><p>Find answers or get in touch with EPFO support</p></div></div><div className="help-grid"><div>{[['FAQ','Find answers to frequently asked questions'],['Raise a Grievance','Report an issue and track status'],['Contact Us','Get in touch with EPFO support'],['Locate Office','Find nearest EPFO office']].map(([a,b])=><article className="help-card" key={a}><CircleHelp/><div><b>{a}</b><p>{b}</p></div></article>)}</div><article className="ai"><Bot/><h3>Ask EPFO AI</h3><p>I can help you with UAN, KYC, claims, transfers, passbook and more.</p><div className="suggestions">{['How do I activate my UAN?','Why is my claim rejected?','How to transfer PF after job change?'].map(x=><button key={x}>{x}</button>)}</div><input placeholder="Type your question..." aria-label="Ask EPFO AI"/></article></div></>}
function Login({setAuth}:{setAuth:(x:any)=>void}){const [error,setError]=useState(''),[busy,setBusy]=useState(false);const submit=async(e:any)=>{e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget);try{const d=await request('/auth/login',{method:'POST',body:JSON.stringify({email:f.get('email'),password:f.get('password')})});localStorage.setItem('epfo-token',d.token);setAuth(d)}catch(e:any){setError(e.message)}finally{setBusy(false)}};return <main className="login-page"><section className="login-card"><Logo/><div className="login-illustration"><ShieldCheck/><h1>Your EPF journey,<br/><em>made easy.</em></h1><p>One secure place to view your balance, contributions and claims.</p></div><form onSubmit={submit}><h2>Welcome back</h2><p>Sign in to access your EPFO member portal.</p>{error&&<div className="error">{error}</div>}<label>Email<input name="email" type="email" defaultValue="member@epfo.demo" required/></label><label>Password<input name="password" type="password" defaultValue="Demo@123" required/></label><button className="primary wide" disabled={busy}>{busy?'Signing in…':'Sign in'}</button><small>Demo credentials are pre-filled for you.</small></form></section></main>}
function App(){
  const [auth,setAuth]=useState<any>(null);
  const [data,setData]=useState<Data|null>(null);
  const [page,setPage]=useState('Overview');
  const [toast,setToast]=useState('');

  const load=async(token:string)=>{
    try{
      const d=await request('/dashboard',{},token);
      setData(d);
      setAuth({token,user:d.user});
    }catch(e){
      console.error(e);
    }
  };

  useEffect(()=>{
    const start=async()=>{
      let token=localStorage.getItem('epfo-token');

      if(!token){
        try{
          const d=await request('/auth/login',{
            method:'POST',
            body:JSON.stringify({
              email:'member@epfo.demo',
              password:'Demo@123'
            })
          });

          token=d.token;
          localStorage.setItem('epfo-token', token!);
        }catch(e){
          console.error('Automatic login failed:',e);
          return;
        }
      }

      await load(token!);
    };

    start();
  },[]);

  useEffect(()=>{
    if(toast){
      const t=setTimeout(()=>setToast(''),3500);
      return()=>clearTimeout(t);
    }
  },[toast]);

  if(!data){
    return <div className="loading">Loading your EPF details…</div>;
  }

  const logout=()=>{
    localStorage.removeItem('epfo-token');
    setAuth(null);
    setData(null);
  };

  let body=
    page==='Overview'?<Overview data={data} setPage={setPage}/>:
    page==='Passbook'?<Passbook data={data}/>:
    page==='Claims'?<Claims data={data} token={auth.token} reload={()=>load(auth.token)} toast={setToast}/>:
    page==='My PF'?<MyPF data={data} onUpdate={()=>setToast('Your KYC update request has been started.')}/>:
    page==='My Journey'?<Nominees data={data} token={auth.token} reload={()=>load(auth.token)} toast={setToast}/>:
    <Help/>;

  return <div className="app">
    <Sidebar page={page} setPage={setPage} logout={logout}/>
    <main className="content">
      <Header title={page} user={data.user}/>
      {body}
    </main>
    {toast&&<div className="toast"><CheckCircle2/> {toast}</div>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
