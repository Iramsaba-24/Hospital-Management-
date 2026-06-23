import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { 
  UserPlus, 
  CalendarCheck, 
  CreditCard, 
  LogOut, 
  Pencil, 
  Eye 
} from 'lucide-react';
import Button from '../../../components/controlled/Button'; 
import NameField from '../../../components/controlled/NameField'; // Import your NameField component

// --- Interfaces ---
interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  image: string;
  roleColor: {
    bg: string;
    text: string;
    border: string;
  };
}

// Form values interfaces for react-hook-form
interface RoleFormValues {
  roleSearch: string;
}

interface KeywordFormValues {
  keywordSearch: string;
}

// --- Mock Data ---
const INITIAL_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'John Hook',
    phone: '9686576776',
    role: 'Super Admin',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-400' }
  },
  {
    id: '2',
    name: 'Reyan Jain',
    phone: '852963741',
    role: 'Doctor',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-400' }
  },
  {
    id: '3',
    name: 'Harry Grant',
    phone: '852963741',
    role: 'Pharmacist',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-400' }
  },
  {
    id: '4',
    name: 'Natasha Romanoff',
    phone: '9686576776',
    role: 'Nurse',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-400' }
  },
  {
    id: '5',
    name: 'Jason Abbot',
    phone: '852963741',
    role: 'Admin',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-400' }
  },
  {
    id: '6',
    name: 'Maria Ford',
    phone: '852963741',
    role: 'Receptionist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-400' }
  },
  {
    id: '7',
    name: 'Brad Frost',
    phone: '5454464644',
    role: 'Accountant',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-400' }
  },
  {
    id: '8',
    name: 'April Clinton',
    phone: '852963741',
    role: 'Radiologist',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400' }
  },
  {
    id: '9',
    name: 'Belina Turner',
    phone: '6465465465',
    role: 'Pathology',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    roleColor: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-400' }
  }
];

export default function StaffDirectory() {
  // Setup forms using react-hook-form
  const roleForm = useForm<RoleFormValues>({
    defaultValues: { roleSearch: '' }
  });

  const keywordForm = useForm<KeywordFormValues>({
    defaultValues: { keywordSearch: '' }
  });

  // Watch values directly from forms to handle instant or submit-driven reactive filtering
  const watchedRole = roleForm.watch('roleSearch');
  const watchedKeyword = keywordForm.watch('keywordSearch');

  // Filter Logic based on watched reactive state variables
  const filteredStaff = useMemo(() => {
    return INITIAL_STAFF.filter((member) => {
      const matchesRole = watchedRole 
        ? member.role.toLowerCase().includes(watchedRole.trim().toLowerCase()) 
        : true;
      const matchesKeyword = watchedKeyword 
        ? member.name.toLowerCase().includes(watchedKeyword.trim().toLowerCase()) || member.phone.includes(watchedKeyword.trim())
        : true;
      
      return matchesRole && matchesKeyword;
    });
  }, [watchedRole, watchedKeyword]);

  // Handle mock execution workflows if needed
  const onRoleSearchSubmit = (data: RoleFormValues) => {
    console.log('Role Searched:', data.roleSearch);
  };

  const onKeywordSearchSubmit = (data: KeywordFormValues) => {
    console.log('Keyword Searched:', data.keywordSearch);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-8 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-8 min-h-[85vh]">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Staff Directory</h1>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button name="Add staff" loading={false} type="button" clr="#0088ff" icon={<UserPlus size={16} />} showAlways={true} />
            <Button name="staff Attendance" loading={false} type="button" clr="#0088ff" icon={<CalendarCheck size={16} />} showAlways={true} />
            <Button name="Payroll" loading={false} type="button" clr="#0088ff" icon={<CreditCard size={16} />} showAlways={true} />
            <Button name="leave" loading={false} type="button" clr="#0088ff" icon={<LogOut size={16} />} showAlways={true} />
          </div>
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl">
          
          {/* Form 1: Role Filter via NameField Component */}
          <form onSubmit={roleForm.handleSubmit(onRoleSearchSubmit)} className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <NameField<RoleFormValues>
                name="roleSearch"
                label="Role"
                control={roleForm.control}
                placeholder="Enter role designation..."
                required={false}
              />
            </div>
            <Button name="search" loading={false} type="submit" clr="#0088ff" showAlways={true} />
          </form>

          {/* Form 2: Keyword Filter via NameField Component */}
          <form onSubmit={keywordForm.handleSubmit(onKeywordSearchSubmit)} className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <NameField<KeywordFormValues>
                name="keywordSearch"
                label="Search By Keyword"
                control={keywordForm.control}
                placeholder="Search name or phone..."
                required={false}
              />
            </div>
            <Button name="search" loading={false} type="submit" clr="#0088ff" showAlways={true} />
          </form>

        </div>

        {/* --- GRID STAFF CARDS --- */}
        {filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div 
                key={member.id} 
                className="relative bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 flex gap-5 items-center hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-shadow"
              >
                {/* Action Icons */}
                <div className="absolute top-4 right-4 flex gap-1.5 text-blue-400">
                  <button className="hover:text-blue-600 transition-colors" title="Edit Profile">
                    <Pencil size={13} />
                  </button>
                  <button className="hover:text-blue-600 transition-colors" title="View Profile">
                    <Eye size={14} />
                  </button>
                </div>

                {/* Profile Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Profile Details */}
                <div className="flex flex-col items-start space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">
                    {member.phone}
                  </p>
                  
                  {/* Micro-badge */}
                  <span className={`mt-2 px-2.5 py-0.5 text-[10px] font-semibold border rounded-md tracking-wide uppercase ${member.roleColor.bg} ${member.roleColor.text} ${member.roleColor.border}`}>
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No staff members found matching your search criteria.
          </div>
        )}

      </div>
    </div>
  );
}