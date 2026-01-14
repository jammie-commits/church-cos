import { useAuth } from "@/hooks/use-auth";
import { UserCircle, Mail, Phone, MapPin, Briefcase } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-20 h-20 text-slate-400" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">
                {/* @ts-ignore */}
                {user.fullName || user.firstName + " " + user.lastName}
              </h1>
              <p className="text-slate-500">
                {/* @ts-ignore */}
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </p>
            </div>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                {/* @ts-ignore */}
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {/* @ts-ignore */}
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {/* @ts-ignore */}
                {user.residenceAddress && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {/* @ts-ignore */}
                    <span>{user.residenceAddress}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Professional Details</h3>
              <div className="space-y-3">
                {/* @ts-ignore */}
                {user.occupation && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {/* @ts-ignore */}
                    <span>{user.occupation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
