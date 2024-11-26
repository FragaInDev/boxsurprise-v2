import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";

export function CaixaPersonalizadaCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crie sua Caixa Personalizada</CardTitle>
        <CardDescription>
          Monte uma caixa com itens escolhidos especialmente para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-lg">
            <Link to="/quiz" className="flex items-center gap-2">
            <Sparkle className="w-4 h-4"/>
                Criar Agora
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
