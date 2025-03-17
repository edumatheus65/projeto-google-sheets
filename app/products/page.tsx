"use client";

import { getSheetData } from "../_lib/googleSheetsService";
import { DataTable } from "../_components/ui/data-table";
import { columns } from "./_components/table-columns";
import { StatusCombobox } from "./_components/status-combobox";
import { useEffect, useState } from "react";
import { Product } from "../_lib/types/products";
import { Button } from "../_components/ui/button";

const ProductPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleStatusSelect = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getSheetData();
      setProducts(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      const filtered = products.filter(
        (product: Product) => product.status === selectedStatus,
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }

    setCurrentPage(1);
  }, [selectedStatus, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="bg-white-500 w-full space-y-8 p-8">
      <div className="flex w-full items-center justify-between">
        {/* Esquerda */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Produtos</span>
          <h2 className="text-xl font-semibold">Gestão de Produtos</h2>
        </div>
        {/* Direita */}
        <StatusCombobox
          currentStatus={selectedStatus}
          onSelect={handleStatusSelect}
        />
      </div>
      {/* Controle de paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Button
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* DataTable */}
      <DataTable columns={columns} data={paginatedData} />
    </div>
  );
};

export default ProductPage;
