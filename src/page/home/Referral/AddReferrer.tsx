import { useEffect } from "react";
import { useForm, useWatch, type Control, type FieldValues } from "react-hook-form";
import ButtonField from "../../../components/controlled/ButtonField";
import Dropdown from "../../../components/controlled/Dropdown";
import TextField from "../../../components/controlled/TextField";
import type { ReferralPerson } from "./types";
import MobileField from "../../../components/controlled/MobileField";

interface Props {
    open: boolean;
    onClose: () => void;
    data: ReferralPerson | null;
    onSave: (data: ReferralPerson) => void;
}
 
type CommissionModule =
    | "OPD"
    | "IPD"
    | "Pharmacy"
    | "Pathology"
    | "Radiology"
    | "Blood Bank"
    | "Ambulance";


interface ReferrerForm {
    referralName: string;
    category: string;
    contact: string;
    contactPerson: string;
    contactPersonPhone: string;
    address: string;
    standardCommission: number;

    OPD: number;
    IPD: number;
    Pharmacy: number;
    Pathology: number;
    Radiology: number;
    "Blood Bank": number;
    Ambulance: number;
}

const categories = [
    "Doctor",
    "Hospital",
    "Clinic",
    "Laboratory",
    "Pharmacy",
];


const AddReferrer = ({
    open,
    onClose,
    data,
    onSave,
}: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<ReferrerForm>({
        defaultValues: {
            referralName: "",
            category: "",
            contact: "",
            contactPerson: "",
            contactPersonPhone: "",
            address: "",
            standardCommission: 0,

            OPD: 0,
            IPD: 0,
            Pharmacy: 0,
            Pathology: 0,
            Radiology: 0,
            "Blood Bank": 0,
            Ambulance: 0,
        },
    });

    const formControl = control as unknown as Control<FieldValues>;

    const commissionModules: CommissionModule[] = [
        "OPD",
        "IPD",
        "Pharmacy",
        "Pathology",
        "Radiology",
        "Blood Bank",
        "Ambulance",
    ];

    useEffect(() => {
        if (data) {
            const values: Partial<ReferrerForm> = {
                referralName: data.referralName,
                category: data.category,
                contact: data.contact,
                contactPerson: data.contactPerson,
                contactPersonPhone: data.contactPersonPhone,
                address: data.address,
                standardCommission: data.standardCommission,
            };

            data.modules.forEach((item) => {
                values[item.module as CommissionModule] = item.percentage;
            });

            reset(values);
        } else {
            reset();
        }
    }, [data, reset]);

    const standardCommission = useWatch({
        control,
        name: "standardCommission",
    });
    const applyAll = () => {
        commissionModules.forEach((module) => {
            setValue(module, Number(standardCommission));
        });
    };

    const submit = (values: ReferrerForm) => {
        const payload: ReferralPerson = {
            id: data?.id || 0,        
            referralName: values.referralName,
            category: values.category,
            contact: values.contact,
            contactPerson: values.contactPerson,
            contactPersonPhone: values.contactPersonPhone,
            address: values.address,
            standardCommission: Number(values.standardCommission),

            modules: commissionModules.map((module) => ({
                module,
                percentage: Number(values[module]),
            })),
        };

        onSave(payload);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 text-xs">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-auto">

                {/* Header */}

                <div className="bg-blue-600 text-white px-5 py-3 flex justify-between rounded-t-lg">

                    <h2 className="font-semibold text-lg">
                        {data ? "Edit Referral Person" : "Add Referral Person"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="p-5"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                        <TextField
                            control={formControl}
                            name="referralName"
                            label="Referral Name"
                            required
                        />

                        <Dropdown
                            control={formControl}
                            name="category"
                            label="Category"
                            required
                            options={categories}
                        />

                        <MobileField
                            control={formControl}
                            name="contact"
                            label="Contact"
                            required
                        />

                        <TextField
                            control={formControl}
                            name="contactPerson"
                            label="Contact Person Name"
                        />

                        <MobileField
                            control={formControl}
                            name="contactPersonPhone"
                            label="Contact Person Phone"
                        />

                        <TextField
                            control={formControl}
                            name="standardCommission"
                            label="Standard Commission (%)"
                            type="number"
                        />

                        <div className="md:col-span-2 lg:col-span-3">

                            <TextField
                                control={formControl}
                                name="address"
                                label="Address"
                            />

                        </div>

                    </div>

                    {/* Commission Section */}

                    <div className="mt-8 border rounded-lg overflow-hidden">

                        <div className="bg-gray-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <h3 className="font-semibold text-gray-700">
                                Module Wise Commission
                            </h3>

                            <ButtonField
                                loading={false}
                                name="Apply To All"
                                clr="#2563eb"
                                onClick={applyAll}
                            />

                        </div>

                        <div className="p-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                {commissionModules.map((module) => (
                                    <TextField
                                        key={module}
                                        control={formControl}
                                        name={module}
                                        label={`${module} (%)`}
                                        type="number"
                                    />
                                ))}

                            </div>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

                        <ButtonField
                            loading={false}
                            name="Cancel"
                            clr="#6b7280"
                            onClick={onClose}
                        />

                        <ButtonField
                            loading={false}
                            name={data ? "Update" : "Save"}
                            clr="#2563eb"
                            type="submit"
                        />

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddReferrer;