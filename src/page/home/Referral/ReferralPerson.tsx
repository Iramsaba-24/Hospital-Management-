import { useMemo, useState } from "react";
import ControlTable, { type Column } from "../../../components/controlled/Controltable";
import ButtonField from "../../../components/controlled/ButtonField";
import AddReferrer from "./AddReferrer";
import { referralPersons } from "./referralData";
import type { ReferralPerson as ReferralPersonType } from "./types";

interface Props {
  onBack: () => void;
}

const ReferralPerson = ({ onBack }: Props) => {
  const [persons, setPersons] =
    useState<ReferralPersonType[]>(referralPersons);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editData, setEditData] =
    useState<ReferralPersonType | null>(null);

  const filteredData = useMemo(() => {
    return persons.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [persons, search]);

const columns: Column<ReferralPersonType>[] = [
  {
    key: "referralName",
    label: "Referral Name",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "contact",
    label: "Contact",
  },
  {
    key: "modules",
    label: "Commission",
    render: (_, row) => (
      <div className="space-y-1">
        {row.modules.map((item) => (
          <div key={item.module} className="text-xs">
            {item.module} : {item.percentage}%
          </div>
        ))}
      </div>
    ),
  },
];

  const savePerson = (data: ReferralPersonType) => {
    if (editData) {
      setPersons((prev) =>
        prev.map((item) =>
          item.id === editData.id
            ? {
                ...data,
                id: editData.id,
              }
            : item
        )
      );
    } else {
      setPersons((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }

    setOpen(false);
    setEditData(null);
  };

  const edit = (id: number | string) => {
    const person = persons.find((x) => x.id === id);

    if (!person) return;

    setEditData(person);
    setOpen(true);
  };

  const remove = (id: number | string) => {
    setPersons((prev) =>
      prev.filter((x) => x.id !== id)
    );
  };

  return (
    <div className="p-4">

      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">

        <h2 className="text-xl font-semibold">
          Referral Person
        </h2>

        <div className="flex flex-wrap gap-2">

          <ButtonField
            loading={false}
            name="Back"
            clr="#6b7280"
            onClick={onBack}
          />

          <ButtonField
            loading={false}
            name="Add Referral Person"
            clr="#2563eb"
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          />

        </div>

      </div>

      <ControlTable
        title=""
        data={filteredData}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onEdit={edit}
        onDelete={remove}
      />

      <AddReferrer
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        data={editData}
        onSave={savePerson}
      />

    </div>
  );
};

export default ReferralPerson;