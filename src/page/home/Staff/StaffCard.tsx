import { Pencil, Eye } from 'lucide-react';

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

interface StaffCardProps {
  member: StaffMember;
}

export default function StaffCard({ member }: StaffCardProps) {
  return (
    <div className="relative bg-pink-50 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 flex gap-5 items-center hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-shadow">
      
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
      <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
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
  );
}