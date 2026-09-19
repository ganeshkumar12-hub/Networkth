import { UserProfile } from '../types';

export interface StudentOutreachRecord {
  id: string;
  name: string;
  institutionName: string;
  approachMethod: string;
  linkedIn: string;
  email: string;
  contactNo?: string;
  response: string;
  dateApproached: string;
  followUp1?: string;
  followUp2?: string;
  followUp3?: string;
  finalMarkup?: string;
}

export const rawStudentsData: StudentOutreachRecord[] = [
  {
    id: 'stud_1',
    name: 'Narendar Reddy Godala',
    institutionName: 'Matrusri Engineering College',
    approachMethod: 'Phone Call',
    linkedIn: 'https://www.linkedin.com/in/narender-reddy-godala-14276b367/',
    email: 'narenderreddygodala85@gmail.com',
    contactNo: '93464 84447',
    response: 'Good',
    dateApproached: '12-09-26',
    followUp1: '15-09-26',
  },
  {
    id: 'stud_2',
    name: 'Shiva Prasad Reddy Patlolla',
    institutionName: 'Malla Reddy University',
    approachMethod: 'Phone Call',
    linkedIn: 'https://www.linkedin.com/in/patlolla-shiva-prasad-reddy-2709a4325/',
    email: 'shivaprasad.mru@gmail.com',
    contactNo: '63041 41842',
    response: 'Good',
    dateApproached: '12-09-26',
    followUp1: '15-09-26',
  },
  {
    id: 'stud_3',
    name: 'Shiva Mallesh',
    institutionName: 'Gokaraju Rangaraju Institute of Engineering (GRIET)',
    approachMethod: 'Phone Call',
    linkedIn: 'https://www.linkedin.com/school/gokarajurangarajuinstituteofengineeringandtechnology/',
    email: 'info@griet.ac.in',
    contactNo: '7207344440',
    response: 'Active',
    dateApproached: '14-09-26',
  },
  {
    id: 'stud_4',
    name: 'Pranith Rao',
    institutionName: 'Mahatma Gandhi Institute of Technology (MGIT)',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/mgit-college/',
    email: 'principal@mgit.ac.in',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_5',
    name: 'Varun Teja',
    institutionName: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/chaitanya-bharathi-institute-of-technology/',
    email: 'cbit.studentlead@cbit.ac.in',
    contactNo: '040-24193276',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_6',
    name: 'Ananya Sharma',
    institutionName: 'Vasavi College of Engineering',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/vasavi-college-of-engg/',
    email: 'principal@staff.vce.ac.in',
    contactNo: '40-23146122',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_7',
    name: 'Karthik Varma',
    institutionName: 'Keshav Memorial Institute of Technology (KMIT)',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/kmit-hyd/',
    email: 'principal@kmit.in',
    contactNo: '040-23261407',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_8',
    name: 'Sahithi Reddy',
    institutionName: 'VNR Vignana Jyothi Institute of Engineering & Technology (VNR VJIET)',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/vnrvjiethyd/',
    email: 'postbox@vnrvjiet.ac.in',
    contactNo: '040-23042758',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_9',
    name: 'Rohit Kulkarni',
    institutionName: 'JNTUH University College of Engineering',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/jntuh-college-of-engineering-hyderabad/',
    email: 'principal.ucesthjntuh@jntuh.ac.in',
    contactNo: '8179887877',
    response: 'Active',
    dateApproached: '15-09-26',
  },
  {
    id: 'stud_10',
    name: 'Sekhar Paidimarry',
    institutionName: 'Osmania University College of Engineering (OUCE)',
    approachMethod: 'LinkedIn and Google',
    linkedIn: 'https://www.linkedin.com/school/university-college-of-engineering-osmania/',
    email: 'sekharpaidimarry@gmail.com',
    contactNo: '9866695963',
    response: 'Active',
    dateApproached: '15-09-26',
  },
];

const STUDENT_AVATAR_POOL = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
];

export const convertedStudentsProfiles: (UserProfile & { passwordHash: string })[] =
  rawStudentsData.map((s, idx) => {
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
      role: 'Student',
      headline: `Collegiate Engineer & Tech Lead at ${s.institutionName}`,
      bio: `Student researcher & developer representing ${s.institutionName}. Interested in software engineering internships, open source, AI hackathons, and direct mentorship from tech leaders. Approached via ${s.approachMethod} on ${s.dateApproached}. Contact: ${s.contactNo || 'Available via message'}.`,
      avatar: STUDENT_AVATAR_POOL[idx % STUDENT_AVATAR_POOL.length],
      location: 'Hyderabad / Telangana / Bengaluru',
      industry: 'Computer Science & Engineering',
      skills: ['Full Stack Development', 'Data Structures', 'Python', 'React', 'Machine Learning'],
      interests: ['Tech Internships', 'Hackathons', 'Mentorship', 'Cloud & Distributed Systems'],
      experience: [
        {
          id: `exp_${s.id}`,
          title: 'Campus Ambassador & Lead Builder',
          company: s.institutionName,
          period: '2023 - Present',
          description: `Leading technical workshops, coordinating developer hackathons, and building web/mobile campus projects at ${s.institutionName}.`,
        },
      ],
      education: [
        {
          id: `edu_${s.id}`,
          degree: 'B.Tech in Computer Science & Engineering',
          school: s.institutionName,
          year: '2026',
        },
      ],
      communities: ['Next-Gen Collegiate Engineers', 'AI Builders Global', 'Hyderabad Tech Hub'],
      socialLinks: {
        linkedin: s.linkedIn,
        website: `https://${s.institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`,
      },
      connectionCount: Math.floor(120 + ((idx * 29) % 350)),
      status: 'active',
      availability: 'Open to Connect',
      outreachMeta: {
        companyOrInstitution: s.institutionName,
        approachMethod: s.approachMethod,
        dateApproached: s.dateApproached,
        followUp1: s.followUp1,
        followUp2: s.followUp2,
        followUp3: s.followUp3,
        response: s.response,
        contactNo: s.contactNo,
      },
      createdAt: '2026-09-12T08:00:00.000Z',
    };
  });
