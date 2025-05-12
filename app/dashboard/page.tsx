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
import { DatePickerWithRange } from "./_components/date-picker-with-range";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { ActivityChart } from "./_components/activity-chart";
import { useAuth } from "../application/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { UserProfileDropdown } from "../_components/user-profile-dropdown";
export default function Home() {
  const { user, logout, isLoading: isLoadingAuth, isAuthenticated } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [totalCaixas, setTotalCaixas] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [mostFrequentWorkLocation, setMostFrequentWorkLocation] = useState("");
  const [userName, setUserName] = useState("Selecione um usuário");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    null,
  );
  const [chartData, setChartData] = useState<{ date: string; total: number }[]>(
    [],
  );

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      console.log(
        "Usuário não está autenticado, redirecionando para /login...",
      );
      router.push("/login");
    }
  }, [isLoadingAuth, isAuthenticated, router]);

  useEffect(() => {
    if (!userId || !dateRange) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `/api/dashboard?userId=${userId}&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`,
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao buscar os dados do dashbaord");
        }
        setTotalCaixas(data.allRecords.length);
        setTotalTasks(data.taskCount);
        setMostFrequentWorkLocation(data.mostWorkedLocation);
        setChartData(data.activityChartData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [userId, dateRange]);

  if (isLoadingAuth) {
    return <div>Carregando informações de autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecionando para o login...</div>;
  }

  return (
    <div className="bg-white-500 w-full space-y-6 p-6">
      <Header>
        <HeaderLeft>
          <HeaderTitle>Dashboard</HeaderTitle>
          <HeaderSubtitle>Visão geral dos dados</HeaderSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <UserProfileDropdown user={user} logout={logout} />
        </HeaderRight>
      </Header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
        <DatePickerWithRange onDateChange={setDateRange} />
        <ComboboxUsers
          onUserSelect={(id, name) => {
            setUserId(id);
            setUserName(name);
          }}
        />
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Atividades por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
