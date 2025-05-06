/**
 * Define exports for all queries in a single file
 */

export {
  selectAllAssets,
  selectAllAssetsWithBeneficiaries,
  insertAssetWithBeneficiaries,
  updateAssetWithBeneficiaries,
  deleteAsset,
  selectSingleAsset,
} from "./asset-beneficiaries";

export {
  selectAllBeneficiaries,
  selectSingleBeneficiary,
  insertBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "./beneficiaries";

export {
  selectAllBusinesses,
  selectSingleBusiness,
  insertBusiness,
  updateBusiness,
  deleteBusiness,
} from "./businesses";

export {
  selectAllClients,
  selectSingleClient,
  insertClient,
  insertTotalInsurableNeeds,
  insertSettlingRequirements,
  insertNewBusiness,
  insertBudget,
  updateClient,
  deleteClient,
  deleteAllClients,
  selectTaxFreezeAtYearAndLifeExpectancy,
  updateClientOnboardingStatus,
} from "./clients";

export {
  selectAllDebts,
  selectSingleDebt,
  insertDebt,
  updateDebt,
  deleteDebt,
} from "./debts";

export {
  selectAllDocuments,
  insertDocument,
  updateDocument,
  deleteDocument,
} from "./documents";

export {
  selectAllGoals,
  selectSingleGoal,
  insertGoal,
  updateGoal,
  deleteGoal,
} from "./goals";

export {
  selectAllIllustrations,
  insertIllustration,
  updateIllustration,
  deleteIllustration,
} from "./illustrations";

export {
  selectAllBusinessKeyPeople,
  insertKeyPerson,
  updateKeyPerson,
  deleteKeyPerson,
} from "./key-people";

export {
  selectAllBusinessShareholders,
  insertShareholder,
  updateShareholder,
  deleteShareholder,
} from "./shareholders";
