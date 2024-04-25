import Image from 'next/image';

interface AnnouncementCardProps {
  title: string;
  content: string;
  author: string;
  authorId: string;
  avatar: string;
  role: string;
  image: string;
}

export default function AnnouncementCard({
  title,
  content,
  author,
  authorId,
  avatar,
  role,
  image,
}: AnnouncementCardProps) {
  return (
    <div className="w-full p-[10px] border border-[#ffffff0f] rounded-[10px] bg-[#ffffff05] flex gap-[14px] cursor-pointer hover:bg-[#ffffff1a] transition ease-in duration-300">
      <div className="w-full flex flex-col gap-[10px]">
        <div className="text-[18px] font-semibold">{title}</div>
        <div className="flex justify-between items-center">
          <div className="flex gap-[10px] items-center">
            <Image
              loader={() => avatar}
              src={avatar}
              width={30}
              height={30}
              alt=""
              className="w-[30px] h-[30px] rounded-full"
            ></Image>
            <div className="flex gap-[6px] items-center">
              <div className="flex gap-2 items-center">
                <div className="text-[13px] ">{author}</div>
                <div className="text-[11px] opacity-60 font-semibold">
                  {authorId}
                </div>
              </div>
            </div>
          </div>
          <div className="px-[10px] py-[2px] bg-[#24323a] rounded capitalize text-[#5eafff] font-semibold text-[13px]">
            {role}
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <div className="text-[12px] font-semibold opacity-70">
            {content.slice(0, 97) + '...'}
          </div>
          <div className="uppercase text-[10px] opacity-70">2 days ago</div>
        </div>
      </div>
      <div className="relative w-[160px] h-[160px]">
        <Image
          loader={() => image}
          src={image}
          width={160}
          height={160}
          className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
          alt=""
        ></Image>
      </div>
    </div>
  );
}
