import { UserProfile } from "@clerk/nextjs";
export default function UserProfilePage(){
    return (
        <div className="flex items-center justify-center h-screen">
            <UserProfile path="/user-profile" routing="path" />
        </div>
    );
}