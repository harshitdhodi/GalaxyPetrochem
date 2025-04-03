import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

export default function AlphabetsBaseCategory() {
  const [selectedGrades, setSelectedGrades] = useState([]);

  const grades = [
    { id: "aas", name: "AAS Solutions", count: 3 },
    { id: "analytical", name: "Analytical Reagents (AR)", count: 5 },
    { id: "ar-iags", name: "AR /IAGS Reagents", count: 1 },
    { id: "bacteriology", name: "Bacteriology", count: 2 },
    { id: "extra-pure", name: "Extra Pure", count: 1 },
    { id: "icp", name: "ICP", count: 2 },
    { id: "laboratory", name: "Laboratory Reagent (LR)", count: 68 },
    { id: "lr-monohydrate", name: "LR (Monohydrate)", count: 2 },
    { id: "microscopy", name: "Microscopy", count: 1 },
    { id: "molecular-biology", name: "Molecular Biology (MB)", count: 2 },
    { id: "aas", name: "AAS Solutions", count: 3 },
    { id: "analytical", name: "Analytical Reagents (AR)", count: 5 },
    { id: "ar-iags", name: "AR /IAGS Reagents", count: 1 },
    { id: "bacteriology", name: "Bacteriology", count: 2 },
    { id: "extra-pure", name: "Extra Pure", count: 1 },
    { id: "icp", name: "ICP", count: 2 },
  ];

  const products = [
    {
      code: "010495",
      name: "α-Amyl Cinnamaldehyde for Synthesis",
      cas: "122-40-7",
      hasTds: true,
      hasMsds: true,
    },
    {
      code: "809250",
      name: "α-Benzoin Oxime Solution (Reagent for Cu, Mo, W)",
      cas: "N.A",
      hasTds: true,
      hasMsds: true,
    },
    {
      code: "007855",
      name: "α-Cyclopentylmandelic Acid",
      cas: "42794-76-4",
      hasTds: true,
      hasMsds: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <nav className="text-sm mb-8">
        <ol className="flex gap-2 mb-4">
          <li>Home</li>
          <li>»</li>
          <li>Products</li>
          <li>»</li>
          <li>Fine Chemical</li>
          <li>»</li>
          <li className="text-red-500">Fine Chemical</li>
          <li>»</li>
          <li className="text-red-500">A</li>
        </ol>
        <hr />
      </nav>

      <div className="grid md:grid-cols-[350px_1fr]  gap-6">
        <div className="bg-blue-100 p-6 ">
          <h2 className=" text-gray-800 text-xl mb-4">Grades</h2>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex border-b border-gray-300 pb-3 items-start space-x-2"
              >
                <Checkbox
                  className="bg-white w-3 h-3 rounded-sm border-gray-500"
                  id={grade.id}
                  checked={selectedGrades.includes(grade.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedGrades([...selectedGrades, grade.id]);
                    } else {
                      setSelectedGrades(
                        selectedGrades.filter((id) => id !== grade.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={grade.id}
                  className="text-[13px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {grade.name} ({grade.count})
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl text-gray-700 font-bold mb-8">
            Showing Products for "A"
          </h1>
          <p className="text-[12px] text-gray-700 font-medium mb-4">
            FINE CHEMICALS & LABORATORY REAGENTS FOR RESEARCH & INDUSTRIES
          </p>

          <div className="flex justify-between bg-blue-100 px-2 py-2 items-center mb-4">
            <p className="text-[13px] font-normal">
              1 to 50 of 105 item(s) displayed
            </p>
            <Select className="" defaultValue="">
              <SelectTrigger className="w-[150px] h-[26px] border rounded-none border-gray-900 text-sm ">
                <SelectValue placeholder="Show per page"  className="font-normal text-sm"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table className="border border-blue-600/20">
  <TableHeader className="bg-blue-800">
    <TableRow>
      <TableHead className="text-white">Product Code</TableHead>
      <TableHead className="text-white">Product Name</TableHead>
      <TableHead className="text-white">CAS</TableHead>
      <TableHead className="text-white">TDS</TableHead>
      <TableHead className="text-white">MSDS</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody >
    {products.map((product, index) => (
      <TableRow
        key={product.code}
        className={ index % 2 === 0 ? 'bg-white text-blue-800 ' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}
      >
        <TableCell className="text-center border-r border-blue-200">{product.code}</TableCell>
        <TableCell className="border-r border-blue-200">{product.name}</TableCell>
        <TableCell className="border-r border-blue-200">{product.cas}</TableCell>
        <TableCell className="border-r border-blue-200">
          {product.hasTds && (
            <Link to="#" className="text-blue-600 hover:underline">
              Specs
            </Link>
          )}
        </TableCell>
        <TableCell>
          {product.hasMsds && (
            <Link to="#" className="text-blue-600 hover:underline">
              MSDS
            </Link>
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

        </div>
      </div>
    </div>
  );
}
