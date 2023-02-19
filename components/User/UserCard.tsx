import Image from "next/image";
import Card from "../Card";
import utilStyles from "@/styles/utils.module.scss";
import { Session } from "next-auth";

interface Prop {
  userData: Session["user"];
  otherInfo?: {
    total: number;
  };
}

const UserCard: React.FC<Prop> = function ({ userData, otherInfo }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-2 min-h-[4em]">
        <p className="text-lg">博主信息</p>
        <Image
          priority
          src={userData?.image || "/images/avatar.jpg"}
          className={utilStyles.borderCircle}
          height={144}
          width={144}
          alt={userData?.name || ""}
        />
        <h1 className="text-xl">{userData?.name}</h1>
        {otherInfo && (
          <div className="w-full flex justify-around">
            <div className=" whitespace-nowrap">
              <label className=" text-gray-600 mr-1">文章</label>
              <span className=" text-gray-600">{otherInfo.total}</span>
            </div>
            <div className=" whitespace-nowrap">
              <label className=" text-gray-600 mr-1">文章</label>
              <span className=" text-gray-600">{otherInfo.total}</span>
            </div>
            <div className=" whitespace-nowrap">
              <label className=" text-gray-600 mr-1">文章</label>
              <span className=" text-gray-600">{otherInfo.total}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
