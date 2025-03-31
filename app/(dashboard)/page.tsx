"use client";

import {
  Activity,
  PackageIcon,
  ShoppingBagIcon,
  TableColumnsSplit,
  User,
} from "lucide-react";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./_components/summary-card";
import { ComboboxUsers } from "./_components/combobox-users";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [totalCaixas, setTotalCaixas] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [mostFrequentWorkLocation, setMostFrequentWorkLocation] = useState("");
  const [userName, setUserName] = useState("Selecione um usuário");

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/dashboard?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao buscar os dados do dashbaord");
        }
        setTotalCaixas(data.allRecords.length);
        setTotalTasks(data.taskCount);
        setMostFrequentWorkLocation(data.mostWorkedLocation);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="bg-white-500 w-full space-y-8 p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Visão geral dos dados</HeaderSubtitle>
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          {/* Componente de calendário */}
          <ComboboxUsers
            onUserSelect={(id, name) => {
              setUserId(id);
              setUserName(name);
            }}
          />
        </HeaderRight>
      </Header>

      <div className="grid grid-cols-2 gap-6">
        <SummaryCard>
          <SummaryCardIcon>
            <PackageIcon />
          </SummaryCardIcon>
          <SummaryCardTitle>Total de Caixas Separadas</SummaryCardTitle>
          <SummaryCardValue>{totalCaixas}</SummaryCardValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryCardIcon>
            <Activity />
          </SummaryCardIcon>
          <SummaryCardTitle>Total de Tasks</SummaryCardTitle>
          <SummaryCardValue>{totalTasks}</SummaryCardValue>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard>
          <SummaryCardIcon>
            <TableColumnsSplit />
          </SummaryCardIcon>
          <SummaryCardTitle>Segmento que mais esteve</SummaryCardTitle>
          <SummaryCardValue>
            {mostFrequentWorkLocation || "N/A"}
          </SummaryCardValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryCardIcon>
            <User />
          </SummaryCardIcon>
          <SummaryCardTitle>Usuário</SummaryCardTitle>
          <SummaryCardValue>{userName}</SummaryCardValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryCardIcon>
            <ShoppingBagIcon />
          </SummaryCardIcon>
          <SummaryCardTitle>Produtos</SummaryCardTitle>
          <SummaryCardValue>20.000</SummaryCardValue>
        </SummaryCard>
      </div>
    </div>
  );
}
