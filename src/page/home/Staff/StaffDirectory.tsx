
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, CalendarCheck, CreditCard, LogOut, Search } from 'lucide-react';
import Button from '../../../components/controlled/Button';
import NameField from '../../../components/controlled/NameField';
import StaffCard from './StaffCard';
import AddStaffForm from '../Staff/Addstaffform';
import StaffAttendance from './StaffAttendance';
import MyLeaves from './StaffLeaves/Leaves';

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  image: string;
  roleColor: { bg: string; text: string; border: string; };
}

interface RoleFormValues    { roleSearch: string; }
interface KeywordFormValues { keywordSearch: string; }

type PageView = "directory" | "leave";

const ROLE_COLOR_MAP: Record<string, StaffMember['roleColor']> = {
  'Super Admin':  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-400'  },
  'Doctor':       { bg: 'bg-blue-50',   text: 'text-blue-500',   border: 'border-blue-400'   },
  'Pharmacist':   { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-400' },
  'Nurse':        { bg: 'bg-cyan-50',   text: 'text-cyan-500',   border: 'border-cyan-400'   },
  'Admin':        { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-400' },
  'Receptionist': { bg: 'bg-pink-50',   text: 'text-pink-500',   border: 'border-pink-400'   },
  'Accountant':   { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-400' },
  'Radiologist':  { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400' },
  'Pathologist':  { bg: 'bg-slate-50',  text: 'text-slate-500',  border: 'border-slate-400'  },
};

const DEFAULT_ROLE_COLOR: StaffMember['roleColor'] = {
  bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-400',
};

const INITIAL_STAFF: StaffMember[] = [
  { id: '1', name: 'John Hook',        phone: '9686576776', role: 'Super Admin',  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-400'  } },
  { id: '2', name: 'Reyan Jain',       phone: '852963741',  role: 'Doctor',       image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-blue-50',   text: 'text-blue-500',   border: 'border-blue-400'   } },
  { id: '3', name: 'Harry Grant',      phone: '852963741',  role: 'Pharmacist',   image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-400' } },
  { id: '4', name: 'Natasha Romanoff', phone: '9686576776', role: 'Nurse',        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-cyan-50',   text: 'text-cyan-500',   border: 'border-cyan-400'   } },
  { id: '5', name: 'Jason Abbot',      phone: '852963741',  role: 'Admin',        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-400' } },
  { id: '6', name: 'Maria Ford',       phone: '852963741',  role: 'Receptionist', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-pink-50',   text: 'text-pink-500',   border: 'border-pink-400'   } },
  { id: '7', name: 'Brad Frost',       phone: '5454464644', role: 'Accountant',   image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-400' } },
  { id: '8', name: 'April Clinton',    phone: '852963741',  role: 'Radiologist',  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400' } },
  { id: '9', name: 'Belina Turner',    phone: '6465465465', role: 'Pathologist',  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  roleColor: { bg: 'bg-slate-50',  text: 'text-slate-500',  border: 'border-slate-400'  } },
];

export default function StaffDirectory() {
  const [pageView,         setPageView]         = useState<PageView>("directory");
  const [isAddFormOpen,    setIsAddFormOpen]    = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [staffList,        setStaffList]        = useState<StaffMember[]>(INITIAL_STAFF);

  const nextNumericId = useMemo(() => {
    const maxId = staffList.reduce((max, m) => {
      const n = parseInt(m.id, 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return maxId + 1;
  }, [staffList]);

  const nextStaffId = `STF-${String(nextNumericId).padStart(3, '0')}`;

  const handleSaveStaff = (data: {
    firstName: string; lastName: string; phone: string; role: string; photo: File | null;
  }) => {
    const newMember: StaffMember = {
      id: String(nextNumericId),
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone,
      role: data.role,
      image: data.photo
        ? URL.createObjectURL(data.photo)
        : `${encodeURIComponent(`${data.firstName} ${data.lastName}`)}&background=random&size=150`,
      roleColor: ROLE_COLOR_MAP[data.role] ?? DEFAULT_ROLE_COLOR,
    };
    setStaffList((prev) => [...prev, newMember]);
    setIsAddFormOpen(false);
  };

  const roleForm    = useForm<RoleFormValues>({ defaultValues: { roleSearch: '' } });
  const keywordForm = useForm<KeywordFormValues>({ defaultValues: { keywordSearch: '' } });
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedRole    = roleForm.watch('roleSearch');
  const watchedKeyword = keywordForm.watch('keywordSearch');

  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      const matchesRole    = watchedRole    ? member.role.toLowerCase().includes(watchedRole.trim().toLowerCase()) : true;
      const matchesKeyword = watchedKeyword ? member.name.toLowerCase().includes(watchedKeyword.trim().toLowerCase()) || member.phone.includes(watchedKeyword.trim()) : true;
      return matchesRole && matchesKeyword;
    });
  }, [watchedRole, watchedKeyword, staffList]);

  const onRoleSearchSubmit    = () => {};
  const onKeywordSearchSubmit = () => {};

  if (pageView === "leave") {
    return <MyLeaves />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-8 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-8 min-h-[85vh]">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Staff Directory
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              name="Add Staff"
              loading={false} type="button" clr="#0088ff"
              icon={<UserPlus size={16} />} showAlways={true}
              onClick={() => setIsAddFormOpen(true)}
            />
            <Button
              name="Attendance"
              loading={false} type="button" clr="#0088ff"
              icon={<CalendarCheck size={16} />} showAlways={true}
              onClick={() => setIsAttendanceOpen(true)}
            />
            <Button
              name="Payroll"
              loading={false} type="button" clr="#0088ff"
              icon={<CreditCard size={16} />} showAlways={true}
            />
            <Button
              name="Leave"
              loading={false} type="button" clr="#0088ff"
              icon={<LogOut size={16} />} showAlways={true}
              onClick={() => setPageView("leave")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl">
          <form onSubmit={roleForm.handleSubmit(onRoleSearchSubmit)} className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <NameField<RoleFormValues>
                name="roleSearch" label="Role"
                control={roleForm.control}
                placeholder="Enter role designation..."
                required={false}
              />
            </div>
            <Button name="Search" loading={false} type="submit" icon={<Search size={16} />} showAlways={true} />
          </form>

          <form onSubmit={keywordForm.handleSubmit(onKeywordSearchSubmit)} className="flex items-end gap-4 w-full">
            <div className="flex-1">
              <NameField<KeywordFormValues>
                name="keywordSearch" label="Search By Keyword"
                control={keywordForm.control}
                placeholder="Search name or phone..."
                required={false}
              />
            </div>
            <Button name="Search" loading={false} type="submit" icon={<Search size={16} />} showAlways={true} />
          </form>
        </div>
        {filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No staff members found matching your search criteria.
          </div>
        )}
      </div>
      {isAddFormOpen && (
        <AddStaffForm
          onClose={() => setIsAddFormOpen(false)}
          onSave={handleSaveStaff}
          nextStaffId={nextStaffId}
        />
      )}
      {isAttendanceOpen && (
        <StaffAttendance
          onClose={() => setIsAttendanceOpen(false)}
          onSave={(data) => { console.log('Attendance:', data); setIsAttendanceOpen(false); }}
        />
      )}
    </div>
  );
}