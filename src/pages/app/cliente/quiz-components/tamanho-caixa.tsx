import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectCaixaProps {
  tamanhoCaixa: string | null;
  setTamanhoCaixa: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SelectCaixa({ tamanhoCaixa, setTamanhoCaixa }: SelectCaixaProps) {
  return (
    <Select onValueChange={setTamanhoCaixa}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o tamanho da caixa" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PEQUENA">Pequena</SelectItem>
        <SelectItem value="MEDIA">Média</SelectItem>
        <SelectItem value="GRANDE">Grande</SelectItem>
      </SelectContent>
    </Select>
  );
}
