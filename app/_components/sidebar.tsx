import { LayoutGridIcon, PackageIcon } from "lucide-react";
import SidebarButton from "./sidebarButton";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white">
      {/* Imagem */}
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold">GooleSheets</h1>
      </div>
      {/* Botões */}

      <div className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">
          <LayoutGridIcon size={18} />
          Dashboard
        </SidebarButton>
        <SidebarButton href="/products">
          <PackageIcon size={18} />
          Products
        </SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
