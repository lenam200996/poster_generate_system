// 取得した値をフロントで紐付く表記に置換する systemsManagement -> システム管理者

export const usersMock = [
  {
    id: "Administrator",
    name: "管理者",
    group: "systemsManagement",
  },
  {
    id: "dummyid0123",
    name: "山田　太郎",
    group: "accommodationSalesDepartment",
  },
  {
    id: "dummyid456",
    name: "長谷川　あゆみ",
    group: "business",
  },
]

export const rolesMock = [
  {
    name: "administrator",
  },
  {
    name: "referenceUser",
  },
  {
    name: "businessAuthority",
  },
]

export const groupMock = [
  {
    name: "systemsManagement",
  },
  {
    name: "accommodationSalesDepartment",
  },
  {
    name: "business",
  },
]

export const groupRolesMock = [
  { name: "productionManager" },
  { name: "dummyAdmin01" },
  { name: "dummyAdmin02" },
  { name: "dummyAdmin03" },
  { name: "dummyAdmin04" },
  { name: "dummyAdmin05" },
  { name: "dummyAdmin06" },
  { name: "dummyAdmin07" },
  { name: "dummyAdmin08" },
  { name: "dummyAdmin09" },
  { name: "dummyAdmin010" },
  { name: "dummyAdmin011" },
]

export const RolesMock = {
  // 管理者
  admin: "admin",
  // 運用担当
  operator: "operator",
  // 原稿更新担当
  manuscriptUpdator: "manuscriptUpdator",
  // 運用＋原稿更新担当
  manuscriptOperator: "manuscriptOperator",
  // 外注担当
  outsourcingManager: "outsourcingManager",
  // CS差し戻し担当
  csReplenishmentManager: "csReplenishmentManager",
} as const
export type RoleTypes = keyof typeof RolesMock

// TODO: 現在の自分のロール 本番はAWS Cognitoから取得する
export const currentRolesMock: RoleTypes[] = [
  RolesMock.admin,
  RolesMock.operator,
  RolesMock.manuscriptUpdator,
  RolesMock.manuscriptOperator,
  RolesMock.outsourcingManager,
  RolesMock.csReplenishmentManager,
]
