import type { PathologyTestData } from "./PathologyTest";

export const pathologyTests: PathologyTestData[] = [
  {
    id: 1,
    testName: "Abdomen X-rays",
    sortName: "AX",
    testType: "Abdomen X-rays",
    category: "Clinical Microbiology",
    subCategory: "Abdomen X-rays",
    method: "Ionizing radiation",
    reportsDay: 1,
    tax: "18%",
    charge: 156,
    amount: 184.08,
    chargeCategory: "Cytopathology",
    taxCategory: "Pathology Tax",
    parameterName: "Liver Function Test",
    referenceRange: "7 to 55 units per liter",
    unit: "(U/L)",
  },
];