import type { Lang } from "./i18n";

// Session data — not translated (proper nouns / numbers), except honorifics handled in copy.
export const SESSION = {
  patientFull: "TAN AH TECK",
  patientDisplay: "Tan Wei Ming",
  nric: "S1234567A",
  mobile: "9123 1234",
  queueNumber: "A-104",
  apptTime: "10:30 AM",
  apptClinic: "Clinic 3B — General Medical",
  outstanding: "$18.40",
  bill: {
    consultation: "$45.00",
    medication: "$12.40",
    subsidy: "-$39.00",
    total: "$18.40",
  },
  followUp: [
    { lab: "2 Jan 2027 (Mon) · 8:05 AM", consult: "13 Jan 2027 (Mon) · 8:00 AM" },
    { lab: "4 Jan 2027 (Wed) · 8:10 AM", consult: "13 Jan 2027 (Mon) · 2:00 PM" },
    { lab: "5 Jan 2027 (Thu) · 8:00 AM", consult: "14 Jan 2027 (Tue) · 8:00 AM" },
  ],
};

export interface Copy {
  // Global chrome
  brandKicker: string;
  brandName: string;
  voiceGuide: string;
  on: string;
  off: string;
  back: string;
  callHelp: string;
  startOver: string;
  continue: string;
  // "Option X of N: " prefix spoken before each card in a set.
  optionOf: (n: number, total: number) => string;
  helpBanner: string;
  vgTurnOn: string;
  vgTurnOff: string;
  callHelpAnnounce: string;
  startOverAnnounce: string;
  // Currency words for spoken amounts (so "$" is never read as "US dollar").
  curDollar: string;
  curCent: string;
  curMinus: string;

  // Reusable spoken-boilerplate helpers so screen speech is fully translated.
  pressEnterTo: (action: string) => string;
  asButton: (label: string) => string;
  toMobileNumber: (digits: string) => string;
  checkboxState: (label: string, checked: boolean) => string;
  pressSpaceToToggle: string;
  a1SmsAction: string;
  a1PrintAction: string;
  b1CreditAction: string;
  b1PayNowAction: string;
  b2BookAction: string;
  b2SkipAction: string;
  b2NoteInstruction: string;
  psSmsAction: string;
  psPrintAction: string;
  tySmsAction: string;
  tyPrintAction: string;
  startOverAction: string;
  backAction: string;
  continueAction: string;
  q1YesAction: string;
  q1NoAction: string;
  q2ContinueAction: string;
  selectAction: string;
  appt1Of2: string;
  appt2Of2: string;
  s2ClinicAction: string;
  s2BillAction: string;
  s2BillOutstandingSpeech: (amount: string) => string;

  // Step 1
  s1Instruction: string;
  s1NricLabel: string;
  s1NricHint: string;
  s1NricAnnounce: string;
  s1Deleted: string;
  s1EnterAnnounce: string;
  s1Announce: string;

  // Step 2
  s2Welcome: string;
  s2WelcomeSpeech: string;
  s2Subtitle: string;
  s2ClinicTitle: string;
  s2ClinicDesc: string;
  s2BillTitle: string;
  s2BillOutstanding: string;
  s2BillAmountSpeech: string;
  s2Announce: string;

  // Health declaration
  hdStep: (n: number) => string;
  q1Question: string;
  q2Question: string;
  q2Subtitle: string;
  q3Question: string;
  yes: string;
  no: string;
  notSure: string;
  symptoms: { cough: string; fever: string; soreThroat: string; runnyNose: string; none: string };
  q1Announce: string;
  q2Announce: string;
  q3Announce: string;
  q1Instruction: string;
  q2Instruction: string;
  q3Instruction: string;

  // Branch A1 — check-in
  a1Title: string;
  a1TimeLabel: string;
  a1ClinicLabel: string;
  a1QueueLabel: string;
  a1DeliveryHeading: string;
  a1DeliveryInstruction: string;
  a1SmsTitle: string;
  a1SmsDesc: string;
  a1PrintTitle: string;
  a1PrintDesc: string;
  a1Announce: string;

  // Branch B1 — payment
  b1Title: string;
  b1LineConsultation: string;
  b1LineMedication: string;
  b1LineSubsidy: string;
  b1Total: string;
  b1MethodHeading: string;
  b1MethodSpeech: string;
  b1Credit: string;
  b1CreditDesc: string;
  b1PayNow: string;
  b1PayNowDesc: string;
  b1Announce: string;

  // Payment instructions (how-to before success)
  piQrTitle: string;
  piQrInstruction: string;
  piQrAnnounce: string;
  piCardTitle: string;
  piCardInstruction: string;
  piCardAnnounce: string;
  piContinueHint: string;

  // Branch B2 — follow-up
  b2Title: string;
  b2Note: string;
  b2Option: (n: number) => string;
  b2LabLabel: string;
  b2ConsultLabel: string;
  b2Select: (n: number) => string;
  b2Skip: string;
  b2Announce: string;

  // Payment successful (receipt delivery choice)
  psTitle: string;
  psSubtitle: string;
  psIntro: string;
  psSms: string;
  psPrint: string;
  psAnnounce: string;
  psSmsConfirm: string;
  psPrintConfirm: string;

  // Receipt
  rcTitle: string;
  rcQueueLabel: string;
  rcThanks: string;
  rcSms: string;
  rcPrint: string;
  rcDone: string;
  rcAnnounce: string;

  // Payment flow end — thank you
  tyTitle: string;
  tySubtitle: string;
  tyAnnounce: string;
  tyFollowUpHeading: string;
  tySms: string;
  tyPrint: string;
  tySmsConfirm: string;
  tyPrintConfirm: string;
}

const en: Copy = {
  brandKicker: "POLYCLINIC REGISTRATION",
  brandName: "Tampines Polyclinic",
  voiceGuide: "Voice Guide",
  on: "ON",
  off: "OFF",
  back: "Back",
  callHelp: "Call Help",
  startOver: "Start Over",
  continue: "Continue",
  optionOf: (n, total) => `Option ${n} of ${total}: `,
  helpBanner: "Please wait — a staff ambassador will attend to you shortly.",
  vgTurnOn: "Press Enter to turn on.",
  vgTurnOff: "Press Enter to turn off.",
  callHelpAnnounce: "Call Help, button. Press Enter to request staff assistance.",
  startOverAnnounce: "Start Over, button. Press Enter to reset the kiosk.",
  curDollar: "dollars",
  curCent: "cents",
  curMinus: "minus",

  pressEnterTo: (action) => `Press Enter to ${action}.`,
  asButton: (label) => `${label}, button.`,
  toMobileNumber: (digits) => ` to mobile number ${digits},`,
  checkboxState: (label, checked) => `${label}, checkbox, ${checked ? "checked" : "unchecked"}.`,
  pressSpaceToToggle: "Press Space to toggle.",
  a1SmsAction: "receive your queue ticket on your phone",
  a1PrintAction: "print a paper ticket from the printer below",
  b1CreditAction: "pay using the card terminal to the left of the keyboard",
  b1PayNowAction: "display a Q R code to scan with your mobile banking app",
  b2BookAction: "book",
  b2SkipAction: "book later using the HealthHub app",
  b2NoteInstruction: "Press Tab to review your options.",
  psSmsAction: "receive your receipt by S M S",
  psPrintAction: "print a paper receipt from the printer below",
  tySmsAction: "receive your appointment slip by S M S",
  tyPrintAction: "print a paper slip from the printer below",
  startOverAction: "reset the kiosk",
  backAction: "return to the previous screen",
  continueAction: "continue",
  q1YesAction: "select Yes and proceed to question 2",
  q1NoAction: "select No and proceed to question 2",
  q2ContinueAction: "proceed to question 3",
  selectAction: "select",
  appt1Of2: "Appointment 1 of 2, ",
  appt2Of2: "Appointment 2 of 2, ",
  s2ClinicAction: "check in for your appointment",
  s2BillAction: "review and pay",
  s2BillOutstandingSpeech: (amount) => `Outstanding balance ${amount}.`,

  s1Instruction: "Select your language, then scan your card or type your NRIC below.",
  s1NricLabel: "NRIC number",
  s1NricHint: "Type your 9-character NRIC and press Enter, or rest your card face-down on the scanner below.",
  s1NricAnnounce:
    "NRIC number, edit text. Type your 9-character NRIC and press Enter, or scan your card on the scanner below.",
  s1Deleted: "deleted",
  s1EnterAnnounce: "Enter, button. Press Enter to submit your NRIC number and continue.",
  s1Announce:
    "Language selection. Use Tab to move through options and Enter to select, or scan your identity card or phone barcode face-down on the scanner below the screen.",

  s2Welcome: `Welcome, MR ${SESSION.patientFull}`,
  s2WelcomeSpeech: "Welcome, Mr Tan, what would you like to do today? Press Tab to select.",
  s2Subtitle: "What would you like to do today?",
  s2ClinicTitle: "Clinic Appointment & Check-In",
  s2ClinicDesc: "Confirm today's booking and get your queue ticket.",
  s2BillTitle: "Pay Bills",
  s2BillOutstanding: `Outstanding: ${SESSION.outstanding}`,
  s2BillAmountSpeech: "18 dollars and 40 cents",
  s2Announce:
    "Welcome, Mr Tan Ah Teck. Heading level 1. What would you like to do today? Press Tab to navigate your options, or Shift-Tab to go to voice guide settings.",

  hdStep: (n) => `Health Declaration (${n} of 3)`,
  q1Question: "Have you travelled overseas in the last 14 days?",
  q2Question: "Do you currently have any of these symptoms?",
  q2Subtitle: "You can choose more than one.",
  q3Question: "Do you have a fever of 38°C or higher?",
  yes: "Yes",
  no: "No",
  notSure: "I'm not sure",
  symptoms: { cough: "Cough", fever: "Fever", soreThroat: "Sore throat", runnyNose: "Runny nose", none: "None of the above" },
  q1Announce:
    "Health declaration, question 1 of 3. Heading level 1. Have you travelled overseas in the last 14 days? Press Tab to choose Yes or No.",
  q2Announce:
    "Health declaration, question 2 of 3. Heading level 1. Do you currently have any of these symptoms? Press Tab to review symptom options.",
  q3Announce:
    "Health declaration, question 3 of 3. Heading level 1. Do you have a fever of 38 degrees Celsius or higher? Press Tab to select an option.",
  q1Instruction: "Press Tab to choose Yes or No.",
  q2Instruction: "You can choose more than one. Press Tab to review the symptoms, then choose Continue.",
  q3Instruction: "Press Tab to choose Yes, No, or I'm not sure.",

  a1Title: "Clinic Appointment",
  a1TimeLabel: "Time",
  a1ClinicLabel: "Clinic",
  a1QueueLabel: "Your queue number",
  a1DeliveryHeading: "Get your queue ticket:",
  a1DeliveryInstruction: "Press Tab to view options.",
  a1SmsTitle: "Send via SMS",
  a1SmsDesc: `To ${SESSION.mobile}`,
  a1PrintTitle: "Print paper slip",
  a1PrintDesc: "From the printer below the shelf.",
  a1Announce: `Clinic appointment found. Heading level 1. Time ${SESSION.apptTime}, ${SESSION.apptClinic}. Your queue number is ${SESSION.queueNumber}. How would you like to receive your queue ticket? Press Tab to choose ticket delivery.`,

  b1Title: "Outstanding Bill Details",
  b1LineConsultation: "Consultation (General Medical)",
  b1LineMedication: "Medication (Standard Subsidy)",
  b1LineSubsidy: "Government Subsidy (CHAS / Pioneer)",
  b1Total: "Total amount due",
  b1MethodHeading: "Select payment method:",
  b1MethodSpeech: "Select payment method. Use Tab to select an option.",
  b1Credit: "Credit/Debit Card",
  b1CreditDesc: "Insert or tap",
  b1PayNow: "PayNow QR",
  b1PayNowDesc: "Scan to pay",
  b1Announce:
    "Outstanding bill details. Heading level 1. Consultation 45 dollars. Medication 12 dollars and 40 cents. Government Pioneer Generation subsidy minus 39 dollars. Total amount due is eighteen dollars and forty cents. Press Tab to select a payment method.",

  piQrTitle: "Scan to pay with PayNow",
  piQrInstruction: "Scan this QR code with your bank app to make payment.",
  piQrAnnounce: "Scan this QR code with your bank app to make payment.",
  piCardTitle: "Pay by card",
  piCardInstruction: "Tap or insert your card into the terminal to the left of the keyboard.",
  piCardAnnounce: "Tap or insert your card into the terminal to the left of the keyboard.",
  piContinueHint: "Tap anywhere or press Enter once payment is complete.",

  b2Title: "Select Follow-Up Appointment",
  b2Note: "Doctor requested a Fasting Blood Lab and a Review Consultation.",
  b2Option: (n) => `Option ${n}`,
  b2LabLabel: "Fasting Lab",
  b2ConsultLabel: "Consultation",
  b2Select: (n) => `Select Option ${n}`,
  b2Skip: "Skip — book later via HealthHub",
  b2Announce:
    "Payment successful. Select follow-up appointment. Heading level 1. The doctor has requested a Fasting Blood Lab and a Review Consultation. Three pre-arranged options are available. Press Tab to review options.",

  psTitle: "Payment Successful",
  psSubtitle: `You paid ${SESSION.outstanding}. How would you like your receipt?`,
  psIntro: "You paid 18 dollars and 40 cents. How would you like your receipt? Press Tab to select.",
  psSms: "Send via SMS",
  psPrint: "Print receipt",
  psAnnounce: `Payment successful. Heading level 1. You paid ${SESSION.outstanding}. How would you like your receipt? Press Tab to send it by S M S or print a paper receipt.`,
  psSmsConfirm: `Your receipt will be sent by S M S to ${SESSION.mobile}.`,
  psPrintConfirm: "Your receipt is printing from the printer below.",

  rcTitle: "You're all set",
  rcQueueLabel: "Your queue number",
  rcThanks: "Please take a seat. Your number will be called on the clinic display.",
  rcSms: "Send via SMS",
  rcPrint: "Print paper slip",
  rcDone: "Done",
  rcAnnounce: `You are all set. Heading level 1. Your queue number is ${SESSION.queueNumber}. Please take a seat and watch the clinic display. Press Tab to send your ticket by S M S or print a paper slip.`,

  tyTitle: "Thank you",
  tySubtitle: "Your payment is complete. Have a good day.",
  tyAnnounce: "Thank you. Heading level 1. Your payment is complete. Have a good day. Press Tab to start over for the next patient.",
  tyFollowUpHeading: "Your follow-up appointment is booked:",
  tySms: "Send via SMS",
  tyPrint: "Print slip",
  tySmsConfirm: `Your appointment slip will be sent by S M S to ${SESSION.mobile}.`,
  tyPrintConfirm: "Your appointment slip is printing from the printer below.",
};

const zh: Copy = {
  brandKicker: "综合诊疗所登记",
  brandName: "淡滨尼综合诊疗所",
  voiceGuide: "语音导览",
  on: "开",
  off: "关",
  back: "返回",
  callHelp: "呼叫协助",
  startOver: "重新开始",
  continue: "继续",
  optionOf: (n, total) => `选项 ${n}，共 ${total} 个：`,
  helpBanner: "请稍候——工作人员将很快前来协助您。",
  vgTurnOn: "按 Enter 键开启。",
  vgTurnOff: "按 Enter 键关闭。",
  callHelpAnnounce: "呼叫协助，按钮。按 Enter 键请求工作人员协助。",
  startOverAnnounce: "重新开始，按钮。按 Enter 键重置服务机。",
  curDollar: "元",
  curCent: "分",
  curMinus: "负",

  pressEnterTo: (action) => `按 Enter 键${action}。`,
  asButton: (label) => `${label}，按钮。`,
  toMobileNumber: (digits) => `，发送至手机号码 ${digits}，`,
  checkboxState: (label, checked) => `${label}，复选框，${checked ? "已选中" : "未选中"}。`,
  pressSpaceToToggle: "按空格键切换。",
  a1SmsAction: "接收手机上的轮候票",
  a1PrintAction: "从下方打印机打印纸质票",
  b1CreditAction: "使用键盘左侧的读卡终端付款",
  b1PayNowAction: "显示二维码以用手机银行应用扫描",
  b2BookAction: "预约",
  b2SkipAction: "稍后通过 HealthHub 应用预约",
  b2NoteInstruction: "按 Tab 键查看您的选项。",
  psSmsAction: "以短信接收您的收据",
  psPrintAction: "从下方打印机打印纸质收据",
  tySmsAction: "以短信接收您的复诊单",
  tyPrintAction: "从下方打印机打印纸质复诊单",
  startOverAction: "重置服务机",
  backAction: "返回上一屏幕",
  continueAction: "继续",
  q1YesAction: "选择“是”并前往第2题",
  q1NoAction: "选择“否”并前往第2题",
  q2ContinueAction: "前往第3题",
  selectAction: "选择",
  appt1Of2: "第1项预约，共2项，",
  appt2Of2: "第2项预约，共2项，",
  s2ClinicAction: "为您的预约报到",
  s2BillAction: "查看并付款",
  s2BillOutstandingSpeech: (amount) => `未付款项 ${amount}。`,

  s1Instruction: "请选择语言，然后扫描您的证件或在下方输入身份证号码。",
  s1NricLabel: "身份证号码",
  s1NricHint: "请输入9位身份证号码并按 Enter 键，或将证件正面朝下放在下方的扫描器上。",
  s1NricAnnounce: "身份证号码，编辑框。请输入9位身份证号码并按 Enter 键，或将证件放在下方的扫描器上扫描。",
  s1Deleted: "已删除",
  s1EnterAnnounce: "确认，按钮。按 Enter 键提交您的身份证号码并继续。",
  s1Announce: "语言选择。使用 Tab 键浏览选项，按 Enter 键选择，或将身份证或手机条码正面朝下放在屏幕下方的扫描器上。",

  s2Welcome: "欢迎，陈亚德先生",
  s2WelcomeSpeech: "欢迎，陈先生，请问您今天想办理什么？按 Tab 键选择。",
  s2Subtitle: "请问今天需要办理什么？",
  s2ClinicTitle: "诊所预约与报到",
  s2ClinicDesc: "确认今天的预约并领取轮候票。",
  s2BillTitle: "缴付账单",
  s2BillOutstanding: `未付款项：${SESSION.outstanding}`,
  s2BillAmountSpeech: "18 元 40 分",
  s2Announce: "欢迎，陈亚德先生。标题一级。请问今天需要办理什么？按 Tab 键浏览选项，或按 Shift-Tab 键前往语音导览设置。",

  hdStep: (n) => `健康申报（第 ${n} / 3 项）`,
  q1Question: "您在过去14天内是否曾出国？",
  q2Question: "您目前是否有以下任何症状？",
  q2Subtitle: "可选择多项。",
  q3Question: "您是否发烧达38°C或以上？",
  yes: "是",
  no: "否",
  notSure: "不确定",
  symptoms: { cough: "咳嗽", fever: "发烧", soreThroat: "喉咙痛", runnyNose: "流鼻涕", none: "以上皆无" },
  q1Announce: "健康申报，第1项，共3项。标题一级。您在过去14天内是否曾出国？按 Tab 键选择“是”或“否”。",
  q2Announce: "健康申报，第2项，共3项。标题一级。您目前是否有以下任何症状？按 Tab 键浏览症状选项。",
  q3Announce: "健康申报，第3项，共3项。标题一级。您是否发烧达38摄氏度或以上？按 Tab 键选择。",
  q1Instruction: "按 Tab 键选择是或否。",
  q2Instruction: "您可以选择多项。按 Tab 键查看症状选项，然后选择继续。",
  q3Instruction: "按 Tab 键选择是、否或不确定。",

  a1Title: "诊所预约",
  a1TimeLabel: "时间",
  a1ClinicLabel: "诊所",
  a1QueueLabel: "您的轮候号码",
  a1DeliveryHeading: "领取您的轮候票：",
  a1DeliveryInstruction: "按 Tab 键查看选项。",
  a1SmsTitle: "以短信发送",
  a1SmsDesc: `发送至 ${SESSION.mobile}`,
  a1PrintTitle: "打印纸质票",
  a1PrintDesc: "从下方的打印机取出。",
  a1Announce: `已找到诊所预约。标题一级。时间 ${SESSION.apptTime}，${SESSION.apptClinic}。您的轮候号码是 ${SESSION.queueNumber}。您希望如何领取轮候票？按 Tab 键选择领取方式。`,

  b1Title: "未付账单明细",
  b1LineConsultation: "门诊（普通内科）",
  b1LineMedication: "药物（标准津贴）",
  b1LineSubsidy: "政府津贴（CHAS / 建国一代）",
  b1Total: "应付总额",
  b1MethodHeading: "选择付款方式：",
  b1MethodSpeech: "选择付款方式。按 Tab 键选择一个选项。",
  b1Credit: "信用卡",
  b1CreditDesc: "挥卡或感应",
  b1PayNow: "PayNow 二维码",
  b1PayNowDesc: "扫码付款",
  b1Announce: "未付账单明细。标题一级。门诊45元。药物12元4角。政府建国一代津贴减39元。应付总额为18元4角。按 Tab 键选择付款方式。",

  piQrTitle: "使用 PayNow 扫码付款",
  piQrInstruction: "请用您的银行应用程序扫描此二维码进行付款。",
  piQrAnnounce: "请用您的银行应用程序扫描此二维码进行付款。",
  piCardTitle: "刷卡付款",
  piCardInstruction: "请在键盘左侧的读卡器上拍卡或插卡。",
  piCardAnnounce: "请在键盘左侧的读卡器上拍卡或插卡。",
  piContinueHint: "付款完成后，轻触屏幕任意处或按 Enter 键继续。",

  b2Title: "选择复诊预约",
  b2Note: "医生要求进行空腹血液检查及复诊咨询。",
  b2Option: (n) => `方案 ${n}`,
  b2LabLabel: "空腹检查",
  b2ConsultLabel: "复诊",
  b2Select: (n) => `选择方案 ${n}`,
  b2Skip: "跳过——稍后通过 HealthHub 预约",
  b2Announce: "付款成功。选择复诊预约。标题一级。医生要求进行空腹血液检查及复诊咨询。现有三个预设方案。按 Tab 键浏览方案。",

  psTitle: "付款成功",
  psSubtitle: `您已支付 ${SESSION.outstanding}。您希望如何领取收据？`,
  psIntro: "您已支付 18 元 40 分。您希望如何领取收据？按 Tab 键选择。",
  psSms: "以短信发送",
  psPrint: "打印收据",
  psAnnounce: `付款成功。标题一级。您已支付 ${SESSION.outstanding}。您希望如何领取收据？按 Tab 键以短信发送或打印纸质收据。`,
  psSmsConfirm: `您的收据将以短信发送至 ${SESSION.mobile}。`,
  psPrintConfirm: "您的收据正在下方的打印机打印。",

  rcTitle: "已全部完成",
  rcQueueLabel: "您的轮候号码",
  rcThanks: "请就座。诊所显示屏将叫号。",
  rcSms: "以短信发送",
  rcPrint: "打印纸质票",
  rcDone: "完成",
  rcAnnounce: `已全部完成。标题一级。您的轮候号码是 ${SESSION.queueNumber}。请就座并留意诊所显示屏。按 Tab 键以短信发送轮候票或打印纸质票。`,

  tyTitle: "谢谢",
  tySubtitle: "您的付款已完成。祝您有美好的一天。",
  tyAnnounce: "谢谢。标题一级。您的付款已完成。祝您有美好的一天。按 Tab 键为下一位病人重新开始。",
  tyFollowUpHeading: "您的复诊预约已确认：",
  tySms: "以短信发送",
  tyPrint: "打印纸质票",
  tySmsConfirm: `您的复诊单将以短信发送至 ${SESSION.mobile}。`,
  tyPrintConfirm: "您的复诊单正在下方的打印机打印。",
};

const ms: Copy = {
  brandKicker: "PENDAFTARAN POLIKLINIK",
  brandName: "Poliklinik Tampines",
  voiceGuide: "Panduan Suara",
  on: "HIDUP",
  off: "MATI",
  back: "Kembali",
  callHelp: "Panggil Bantuan",
  startOver: "Mula Semula",
  continue: "Teruskan",
  optionOf: (n, total) => `Pilihan ${n} daripada ${total}: `,
  helpBanner: "Sila tunggu — seorang petugas akan membantu anda sebentar lagi.",
  vgTurnOn: "Tekan Enter untuk hidupkan.",
  vgTurnOff: "Tekan Enter untuk matikan.",
  callHelpAnnounce: "Panggil Bantuan, butang. Tekan Enter untuk meminta bantuan kakitangan.",
  startOverAnnounce: "Mula Semula, butang. Tekan Enter untuk menetapkan semula kiosk.",
  curDollar: "dolar",
  curCent: "sen",
  curMinus: "tolak",

  pressEnterTo: (action) => `Tekan Enter untuk ${action}.`,
  asButton: (label) => `${label}, butang.`,
  toMobileNumber: (digits) => ` ke nombor mudah alih ${digits},`,
  checkboxState: (label, checked) => `${label}, kotak semak, ${checked ? "ditanda" : "tidak ditanda"}.`,
  pressSpaceToToggle: "Tekan Ruang untuk togol.",
  a1SmsAction: "menerima tiket giliran anda di telefon anda",
  a1PrintAction: "mencetak tiket kertas dari pencetak di bawah",
  b1CreditAction: "membayar menggunakan terminal kad di sebelah kiri papan kekunci",
  b1PayNowAction: "memaparkan kod Q R untuk diimbas dengan aplikasi perbankan mudah alih anda",
  b2BookAction: "menempah",
  b2SkipAction: "menempah kemudian menggunakan aplikasi HealthHub",
  b2NoteInstruction: "Tekan Tab untuk menyemak pilihan anda.",
  psSmsAction: "menerima resit anda melalui S M S",
  psPrintAction: "mencetak resit kertas dari pencetak di bawah",
  tySmsAction: "menerima slip temu janji anda melalui S M S",
  tyPrintAction: "mencetak slip kertas dari pencetak di bawah",
  startOverAction: "menetapkan semula kiosk",
  backAction: "kembali ke skrin sebelumnya",
  continueAction: "teruskan",
  q1YesAction: "memilih Ya dan meneruskan ke soalan 2",
  q1NoAction: "memilih Tidak dan meneruskan ke soalan 2",
  q2ContinueAction: "meneruskan ke soalan 3",
  selectAction: "memilih",
  appt1Of2: "Temu janji 1 daripada 2, ",
  appt2Of2: "Temu janji 2 daripada 2, ",
  s2ClinicAction: "daftar masuk untuk temu janji anda",
  s2BillAction: "menyemak dan membayar",
  s2BillOutstandingSpeech: (amount) => `Tertunggak ${amount}.`,

  s1Instruction: "Pilih bahasa anda, kemudian imbas kad atau taip nombor NRIC di bawah.",
  s1NricLabel: "Nombor NRIC",
  s1NricHint: "Taip NRIC 9 aksara anda dan tekan Enter, atau letakkan kad anda menghadap ke bawah pada pengimbas di bawah.",
  s1NricAnnounce:
    "Nombor NRIC, kotak teks. Taip NRIC 9 aksara anda dan tekan Enter, atau imbas kad anda pada pengimbas di bawah.",
  s1Deleted: "dipadam",
  s1EnterAnnounce: "Enter, butang. Tekan Enter untuk menghantar nombor NRIC anda dan teruskan.",
  s1Announce:
    "Pemilihan bahasa. Gunakan Tab untuk bergerak melalui pilihan dan Enter untuk memilih, atau imbas kad pengenalan atau kod bar telefon anda menghadap ke bawah pada pengimbas di bawah skrin.",

  s2Welcome: "Selamat datang, Encik Tan Ah Teck",
  s2WelcomeSpeech: "Selamat datang, Encik Tan, apa yang anda ingin lakukan hari ini? Tekan Tab untuk pilih.",
  s2Subtitle: "Apa yang anda ingin lakukan hari ini?",
  s2ClinicTitle: "Temu Janji Klinik & Daftar Masuk",
  s2ClinicDesc: "Sahkan tempahan hari ini dan dapatkan tiket giliran anda.",
  s2BillTitle: "Bayar Bil",
  s2BillOutstanding: `Tertunggak: ${SESSION.outstanding}`,
  s2BillAmountSpeech: "18 dolar dan 40 sen",
  s2Announce:
    "Selamat datang, Encik Tan Ah Teck. Tajuk tahap 1. Apa yang anda ingin lakukan hari ini? Tekan Tab untuk menavigasi pilihan anda, atau Shift-Tab untuk ke tetapan panduan suara.",

  hdStep: (n) => `Perisytiharan Kesihatan (${n} daripada 3)`,
  q1Question: "Adakah anda melancong ke luar negara dalam tempoh 14 hari lepas?",
  q2Question: "Adakah anda mempunyai mana-mana gejala ini sekarang?",
  q2Subtitle: "Anda boleh pilih lebih daripada satu.",
  q3Question: "Adakah anda demam 38°C atau lebih tinggi?",
  yes: "Ya",
  no: "Tidak",
  notSure: "Saya tidak pasti",
  symptoms: { cough: "Batuk", fever: "Demam", soreThroat: "Sakit tekak", runnyNose: "Hidung berair", none: "Tiada satu pun di atas" },
  q1Announce:
    "Perisytiharan kesihatan, soalan 1 daripada 3. Tajuk tahap 1. Adakah anda melancong ke luar negara dalam tempoh 14 hari lepas? Tekan Tab untuk pilih Ya atau Tidak.",
  q2Announce:
    "Perisytiharan kesihatan, soalan 2 daripada 3. Tajuk tahap 1. Adakah anda mempunyai mana-mana gejala ini sekarang? Tekan Tab untuk menyemak pilihan gejala.",
  q3Announce:
    "Perisytiharan kesihatan, soalan 3 daripada 3. Tajuk tahap 1. Adakah anda demam 38 darjah Celsius atau lebih tinggi? Tekan Tab untuk memilih.",
  q1Instruction: "Tekan Tab untuk memilih Ya atau Tidak.",
  q2Instruction: "Anda boleh pilih lebih daripada satu. Tekan Tab untuk menyemak gejala, kemudian pilih Teruskan.",
  q3Instruction: "Tekan Tab untuk memilih Ya, Tidak, atau Saya tidak pasti.",

  a1Title: "Temu Janji Klinik",
  a1TimeLabel: "Masa",
  a1ClinicLabel: "Klinik",
  a1QueueLabel: "Nombor giliran anda",
  a1DeliveryHeading: "Dapatkan tiket giliran anda:",
  a1DeliveryInstruction: "Tekan Tab untuk melihat pilihan.",
  a1SmsTitle: "Hantar melalui SMS",
  a1SmsDesc: `Ke ${SESSION.mobile}`,
  a1PrintTitle: "Cetak slip kertas",
  a1PrintDesc: "Dari pencetak di bawah para.",
  a1Announce: `Temu janji klinik dijumpai. Tajuk tahap 1. Masa ${SESSION.apptTime}, ${SESSION.apptClinic}. Nombor giliran anda ialah ${SESSION.queueNumber}. Bagaimana anda ingin menerima tiket giliran? Tekan Tab untuk memilih penghantaran tiket.`,

  b1Title: "Butiran Bil Tertunggak",
  b1LineConsultation: "Perundingan (Perubatan Am)",
  b1LineMedication: "Ubat (Subsidi Standard)",
  b1LineSubsidy: "Subsidi Kerajaan (CHAS / Pioneer)",
  b1Total: "Jumlah perlu dibayar",
  b1MethodHeading: "Pilih kaedah pembayaran:",
  b1MethodSpeech: "Pilih kaedah pembayaran. Gunakan Tab untuk memilih pilihan.",
  b1Credit: "Kad Kredit",
  b1CreditDesc: "Lambai atau ketik",
  b1PayNow: "PayNow QR",
  b1PayNowDesc: "Imbas untuk bayar",
  b1Announce:
    "Butiran bil tertunggak. Tajuk tahap 1. Perundingan 45 dolar. Ubat 12 dolar 40 sen. Subsidi Kerajaan Pioneer tolak 39 dolar. Jumlah perlu dibayar ialah lapan belas dolar empat puluh sen. Tekan Tab untuk memilih kaedah pembayaran.",

  piQrTitle: "Imbas untuk bayar dengan PayNow",
  piQrInstruction: "Imbas kod QR ini dengan aplikasi bank anda untuk membuat pembayaran.",
  piQrAnnounce: "Imbas kod QR ini dengan aplikasi bank anda untuk membuat pembayaran.",
  piCardTitle: "Bayar dengan kad",
  piCardInstruction: "Tepuk atau masukkan kad anda ke dalam terminal di sebelah kiri papan kekunci.",
  piCardAnnounce: "Tepuk atau masukkan kad anda ke dalam terminal di sebelah kiri papan kekunci.",
  piContinueHint: "Ketik di mana-mana atau tekan Enter setelah pembayaran selesai.",

  b2Title: "Pilih Temu Janji Susulan",
  b2Note: "Doktor meminta Ujian Makmal Darah Berpuasa dan Perundingan Semakan.",
  b2Option: (n) => `Pilihan ${n}`,
  b2LabLabel: "Makmal Puasa",
  b2ConsultLabel: "Perundingan",
  b2Select: (n) => `Pilih Pilihan ${n}`,
  b2Skip: "Langkau — tempah kemudian melalui HealthHub",
  b2Announce:
    "Pembayaran berjaya. Pilih temu janji susulan. Tajuk tahap 1. Doktor telah meminta Ujian Makmal Darah Berpuasa dan Perundingan Semakan. Tiga pilihan telah disediakan. Tekan Tab untuk menyemak pilihan.",

  psTitle: "Pembayaran Berjaya",
  psSubtitle: `Anda telah membayar ${SESSION.outstanding}. Bagaimana anda mahu resit anda?`,
  psIntro: "Anda telah membayar 18 dolar dan 40 sen. Bagaimana anda mahu resit anda? Tekan Tab untuk memilih.",
  psSms: "Hantar melalui SMS",
  psPrint: "Cetak resit",
  psAnnounce: `Pembayaran berjaya. Tajuk tahap 1. Anda telah membayar ${SESSION.outstanding}. Bagaimana anda mahu resit anda? Tekan Tab untuk menghantar melalui S M S atau mencetak resit kertas.`,
  psSmsConfirm: `Resit anda akan dihantar melalui S M S ke ${SESSION.mobile}.`,
  psPrintConfirm: "Resit anda sedang dicetak dari pencetak di bawah.",

  rcTitle: "Anda telah selesai",
  rcQueueLabel: "Nombor giliran anda",
  rcThanks: "Sila duduk. Nombor anda akan dipanggil pada paparan klinik.",
  rcSms: "Hantar melalui SMS",
  rcPrint: "Cetak slip kertas",
  rcDone: "Selesai",
  rcAnnounce: `Anda telah selesai. Tajuk tahap 1. Nombor giliran anda ialah ${SESSION.queueNumber}. Sila duduk dan perhatikan paparan klinik. Tekan Tab untuk menghantar tiket melalui S M S atau mencetak slip kertas.`,

  tyTitle: "Terima kasih",
  tySubtitle: "Pembayaran anda telah selesai. Semoga hari anda baik.",
  tyAnnounce: "Terima kasih. Tajuk tahap 1. Pembayaran anda telah selesai. Semoga hari anda baik. Tekan Tab untuk mula semula bagi pesakit seterusnya.",
  tyFollowUpHeading: "Temu janji susulan anda telah ditempah:",
  tySms: "Hantar melalui SMS",
  tyPrint: "Cetak slip",
  tySmsConfirm: `Slip temu janji anda akan dihantar melalui S M S ke ${SESSION.mobile}.`,
  tyPrintConfirm: "Slip temu janji anda sedang dicetak dari pencetak di bawah.",
};

const ta: Copy = {
  brandKicker: "பாலிகிளினிக் பதிவு",
  brandName: "தம்பினேஸ் பாலிகிளினிக்",
  voiceGuide: "குரல் வழிகாட்டி",
  on: "இயக்கு",
  off: "நிறுத்து",
  back: "பின்செல்",
  callHelp: "உதவி அழை",
  startOver: "மீண்டும் தொடங்கு",
  continue: "தொடரவும்",
  optionOf: (n, total) => `விருப்பம் ${n} / ${total}: `,
  helpBanner: "தயவுசெய்து காத்திருங்கள் — ஊழியர் விரைவில் உங்களுக்கு உதவுவார்.",
  vgTurnOn: "இயக்க Enter-ஐ அழுத்தவும்.",
  vgTurnOff: "முடக்க Enter-ஐ அழுத்தவும்.",
  callHelpAnnounce: "உதவியை அழைக்கவும், பொத்தான். ஊழியர் உதவியைக் கோர Enter-ஐ அழுத்தவும்.",
  startOverAnnounce: "மீண்டும் தொடங்கு, பொத்தான். கியோஸ்கை மீட்டமைக்க Enter-ஐ அழுத்தவும்.",
  curDollar: "டாலர்",
  curCent: "சதம்",
  curMinus: "கழித்தல்",

  pressEnterTo: (action) => `${action} Enter-ஐ அழுத்தவும்.`,
  asButton: (label) => `${label}, பொத்தான்.`,
  toMobileNumber: (digits) => ` மொபைல் எண் ${digits}-க்கு,`,
  checkboxState: (label, checked) => `${label}, செக்பாக்ஸ், ${checked ? "தேர்ந்தெடுக்கப்பட்டது" : "தேர்ந்தெடுக்கப்படவில்லை"}.`,
  pressSpaceToToggle: "மாற்ற Space-ஐ அழுத்தவும்.",
  a1SmsAction: "உங்கள் தொலைபேசியில் வரிசை டிக்கெட்டைப் பெற",
  a1PrintAction: "கீழே உள்ள அச்சுப்பொறியிலிருந்து காகித டிக்கெட்டை அச்சிட",
  b1CreditAction: "விசைப்பலகையின் இடதுபுறத்தில் உள்ள கார்டு முனையம் மூலம் செலுத்த",
  b1PayNowAction: "உங்கள் மொபைல் வங்கி செயலியால் ஸ்கேன் செய்ய Q R குறியீட்டைக் காட்ட",
  b2BookAction: "முன்பதிவு செய்ய",
  b2SkipAction: "HealthHub செயலி மூலம் பின்னர் முன்பதிவு செய்ய",
  b2NoteInstruction: "உங்கள் விருப்பங்களைப் பார்க்க Tab-ஐ அழுத்தவும்.",
  psSmsAction: "S M S மூலம் உங்கள் ரசீதைப் பெற",
  psPrintAction: "கீழே உள்ள அச்சுப்பொறியிலிருந்து காகித ரசீதை அச்சிட",
  tySmsAction: "S M S மூலம் உங்கள் சந்திப்பு சீட்டைப் பெற",
  tyPrintAction: "கீழே உள்ள அச்சுப்பொறியிலிருந்து காகித சீட்டை அச்சிட",
  startOverAction: "கியோஸ்கை மீட்டமைக்க",
  backAction: "முந்தைய திரைக்குத் திரும்ப",
  continueAction: "தொடர",
  q1YesAction: "ஆம் என்பதைத் தேர்ந்தெடுத்து கேள்வி 2-க்குச் செல்ல",
  q1NoAction: "இல்லை என்பதைத் தேர்ந்தெடுத்து கேள்வி 2-க்குச் செல்ல",
  q2ContinueAction: "கேள்வி 3-க்குச் செல்ல",
  selectAction: "தேர்ந்தெடுக்க",
  appt1Of2: "சந்திப்பு 1 / 2, ",
  appt2Of2: "சந்திப்பு 2 / 2, ",
  s2ClinicAction: "உங்கள் சந்திப்புக்காக பதிவு செய்ய",
  s2BillAction: "பார்த்து செலுத்த",
  s2BillOutstandingSpeech: (amount) => `நிலுவை ${amount}.`,

  s1Instruction: "உங்கள் மொழியைத் தேர்ந்தெடுத்து, உங்கள் அட்டையை ஸ்கேன் செய்யவும் அல்லது கீழே NRIC-ஐ தட்டச்சு செய்யவும்.",
  s1NricLabel: "NRIC எண்",
  s1NricHint: "உங்கள் 9 எழுத்து NRIC-ஐ தட்டச்சு செய்து Enter அழுத்தவும், அல்லது கீழே உள்ள ஸ்கேனரில் அட்டையை முகம் கீழாக வைக்கவும்.",
  s1NricAnnounce:
    "NRIC எண், திருத்தும் புலம். உங்கள் 9 எழுத்து NRIC-ஐ தட்டச்சு செய்து Enter அழுத்தவும், அல்லது கீழே உள்ள ஸ்கேனரில் உங்கள் அட்டையை ஸ்கேன் செய்யவும்.",
  s1Deleted: "நீக்கப்பட்டது",
  s1EnterAnnounce: "Enter, பொத்தான். உங்கள் NRIC எண்ணைச் சமர்ப்பித்துத் தொடர Enter-ஐ அழுத்தவும்.",
  s1Announce:
    "மொழி தேர்வு. விருப்பங்களை நகர்த்த Tab-ஐயும் தேர்ந்தெடுக்க Enter-ஐயும் பயன்படுத்தவும், அல்லது திரைக்கு கீழே உள்ள ஸ்கேனரில் உங்கள் அடையாள அட்டை அல்லது தொலைபேசி பார்கோடை முகம் கீழாக வைக்கவும்.",

  s2Welcome: "வரவேற்கிறோம், திரு. டான் ஆ தெக்",
  s2WelcomeSpeech: "வரவேற்கிறோம், திரு டான், இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்? தேர்ந்தெடுக்க Tab-ஐ அழுத்தவும்.",
  s2Subtitle: "இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
  s2ClinicTitle: "மருத்துவமனை சந்திப்பு & பதிவு",
  s2ClinicDesc: "இன்றைய முன்பதிவை உறுதிசெய்து உங்கள் வரிசை டிக்கெட்டைப் பெறுங்கள்.",
  s2BillTitle: "கட்டணம் செலுத்து",
  s2BillOutstanding: `நிலுவை: ${SESSION.outstanding}`,
  s2BillAmountSpeech: "18 டாலர் 40 சதம்",
  s2Announce:
    "வரவேற்கிறோம், திரு. டான் ஆ தெக். தலைப்பு நிலை 1. இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்? உங்கள் விருப்பங்களை நகர்த்த Tab-ஐ அழுத்தவும், அல்லது குரல் வழிகாட்டி அமைப்புகளுக்கு Shift-Tab-ஐ அழுத்தவும்.",

  hdStep: (n) => `உடல்நல அறிவிப்பு (${n} / 3)`,
  q1Question: "கடந்த 14 நாட்களில் நீங்கள் வெளிநாடு பயணம் செய்தீர்களா?",
  q2Question: "தற்போது உங்களுக்கு இந்த அறிகுறிகள் ஏதேனும் உள்ளதா?",
  q2Subtitle: "ஒன்றுக்கு மேற்பட்டவற்றைத் தேர்வு செய்யலாம்.",
  q3Question: "உங்களுக்கு 38°C அல்லது அதற்கு மேல் காய்ச்சல் உள்ளதா?",
  yes: "ஆம்",
  no: "இல்லை",
  notSure: "எனக்குத் தெரியவில்லை",
  symptoms: { cough: "இருமல்", fever: "காய்ச்சல்", soreThroat: "தொண்டை வலி", runnyNose: "மூக்கு ஒழுகுதல்", none: "மேற்கண்ட எதுவும் இல்லை" },
  q1Announce:
    "உடல்நல அறிவிப்பு, கேள்வி 1 / 3. தலைப்பு நிலை 1. கடந்த 14 நாட்களில் நீங்கள் வெளிநாடு பயணம் செய்தீர்களா? ஆம் அல்லது இல்லை என்பதைத் தேர்வு செய்ய Tab-ஐ அழுத்தவும்.",
  q2Announce:
    "உடல்நல அறிவிப்பு, கேள்வி 2 / 3. தலைப்பு நிலை 1. தற்போது உங்களுக்கு இந்த அறிகுறிகள் ஏதேனும் உள்ளதா? அறிகுறி விருப்பங்களைப் பார்க்க Tab-ஐ அழுத்தவும்.",
  q3Announce:
    "உடல்நல அறிவிப்பு, கேள்வி 3 / 3. தலைப்பு நிலை 1. உங்களுக்கு 38 டிகிரி செல்சியஸ் அல்லது அதற்கு மேல் காய்ச்சல் உள்ளதா? தேர்வு செய்ய Tab-ஐ அழுத்தவும்.",
  q1Instruction: "ஆம் அல்லது இல்லை என்பதைத் தேர்ந்தெடுக்க Tab-ஐ அழுத்தவும்.",
  q2Instruction: "நீங்கள் ஒன்றுக்கு மேற்பட்டவற்றைத் தேர்ந்தெடுக்கலாம். அறிகுறிகளைப் பார்க்க Tab-ஐ அழுத்தி, பின்னர் தொடரவும் என்பதைத் தேர்ந்தெடுக்கவும்.",
  q3Instruction: "ஆம், இல்லை, அல்லது எனக்குத் தெரியவில்லை என்பதைத் தேர்ந்தெடுக்க Tab-ஐ அழுத்தவும்.",

  a1Title: "மருத்துவமனை சந்திப்பு",
  a1TimeLabel: "நேரம்",
  a1ClinicLabel: "மருத்துவமனை",
  a1QueueLabel: "உங்கள் வரிசை எண்",
  a1DeliveryHeading: "உங்கள் வரிசை டிக்கெட்டைப் பெறுங்கள்:",
  a1DeliveryInstruction: "விருப்பங்களைக் காண Tab-ஐ அழுத்தவும்.",
  a1SmsTitle: "SMS மூலம் அனுப்பு",
  a1SmsDesc: `${SESSION.mobile} க்கு`,
  a1PrintTitle: "காகித சீட்டை அச்சிடு",
  a1PrintDesc: "கீழே உள்ள அச்சுப்பொறியிலிருந்து.",
  a1Announce: `மருத்துவமனை சந்திப்பு கண்டறியப்பட்டது. தலைப்பு நிலை 1. நேரம் ${SESSION.apptTime}, ${SESSION.apptClinic}. உங்கள் வரிசை எண் ${SESSION.queueNumber}. உங்கள் வரிசை டிக்கெட்டை எப்படிப் பெற விரும்புகிறீர்கள்? டிக்கெட் விநியோகத்தைத் தேர்வு செய்ய Tab-ஐ அழுத்தவும்.`,

  b1Title: "நிலுவை கட்டண விவரங்கள்",
  b1LineConsultation: "ஆலோசனை (பொது மருத்துவம்)",
  b1LineMedication: "மருந்து (நிலையான மானியம்)",
  b1LineSubsidy: "அரசு மானியம் (CHAS / Pioneer)",
  b1Total: "செலுத்த வேண்டிய மொத்தம்",
  b1MethodHeading: "கட்டண முறையைத் தேர்ந்தெடுக்கவும்:",
  b1MethodSpeech: "கட்டண முறையைத் தேர்ந்தெடுக்கவும். ஒரு விருப்பத்தைத் தேர்ந்தெடுக்க Tab-ஐ பயன்படுத்தவும்.",
  b1Credit: "கிரெடிட் கார்டு",
  b1CreditDesc: "அசைக்கவும் அல்லது தொடவும்",
  b1PayNow: "PayNow QR",
  b1PayNowDesc: "செலுத்த ஸ்கேன் செய்யவும்",
  b1Announce:
    "நிலுவை கட்டண விவரங்கள். தலைப்பு நிலை 1. ஆலோசனை 45 டாலர். மருந்து 12 டாலர் 40 சென்ட். அரசு Pioneer மானியம் கழித்து 39 டாலர். செலுத்த வேண்டிய மொத்தம் பதினெட்டு டாலர் நாற்பது சென்ட். கட்டண முறையைத் தேர்ந்தெடுக்க Tab-ஐ அழுத்தவும்.",

  piQrTitle: "PayNow மூலம் ஸ்கேன் செய்து செலுத்துங்கள்",
  piQrInstruction: "கட்டணம் செலுத்த உங்கள் வங்கி செயலியால் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்.",
  piQrAnnounce: "கட்டணம் செலுத்த உங்கள் வங்கி செயலியால் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்.",
  piCardTitle: "அட்டை மூலம் செலுத்துங்கள்",
  piCardInstruction: "விசைப்பலகையின் இடதுபுறத்தில் உள்ள முனையத்தில் உங்கள் அட்டையைத் தட்டவும் அல்லது செருகவும்.",
  piCardAnnounce: "விசைப்பலகையின் இடதுபுறத்தில் உள்ள முனையத்தில் உங்கள் அட்டையைத் தட்டவும் அல்லது செருகவும்.",
  piContinueHint: "கட்டணம் முடிந்ததும் திரையில் எங்கு வேண்டுமானாலும் தட்டவும் அல்லது Enter அழுத்தவும்.",

  b2Title: "தொடர் சந்திப்பு(களை)த் தேர்ந்தெடுக்கவும்",
  b2Note: "மருத்துவர் பட்டினி இரத்த பரிசோதனை மற்றும் மறுஆய்வு ஆலோசனையைக் கோரினார்.",
  b2Option: (n) => `விருப்பம் ${n}`,
  b2LabLabel: "பட்டினி பரிசோதனை",
  b2ConsultLabel: "ஆலோசனை",
  b2Select: (n) => `விருப்பம் ${n} தேர்ந்தெடு`,
  b2Skip: "தவிர் — பின்னர் HealthHub மூலம் முன்பதிவு செய்யவும்",
  b2Announce:
    "கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது. தொடர் சந்திப்பைத் தேர்ந்தெடுக்கவும். தலைப்பு நிலை 1. மருத்துவர் பட்டினி இரத்த பரிசோதனை மற்றும் மறுஆய்வு ஆலோசனையைக் கோரினார். மூன்று விருப்பங்கள் உள்ளன. விருப்பங்களைப் பார்க்க Tab-ஐ அழுத்தவும்.",

  psTitle: "கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது",
  psSubtitle: `நீங்கள் ${SESSION.outstanding} செலுத்தினீர்கள். உங்கள் ரசீதை எப்படி பெற விரும்புகிறீர்கள்?`,
  psIntro: "நீங்கள் 18 டாலர் 40 சதம் செலுத்தினீர்கள். உங்கள் ரசீதை எப்படி பெற விரும்புகிறீர்கள்? தேர்வு செய்ய Tab-ஐ அழுத்தவும்.",
  psSms: "SMS மூலம் அனுப்பு",
  psPrint: "ரசீதை அச்சிடு",
  psAnnounce: `கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது. தலைப்பு நிலை 1. நீங்கள் ${SESSION.outstanding} செலுத்தினீர்கள். உங்கள் ரசீதை எப்படி பெற விரும்புகிறீர்கள்? S M S மூலம் அனுப்ப அல்லது காகித ரசீதை அச்சிட Tab-ஐ அழுத்தவும்.`,
  psSmsConfirm: `உங்கள் ரசீது ${SESSION.mobile} க்கு S M S மூலம் அனுப்பப்படும்.`,
  psPrintConfirm: "உங்கள் ரசீது கீழே உள்ள அச்சுப்பொறியில் அச்சிடப்படுகிறது.",

  rcTitle: "அனைத்தும் தயார்",
  rcQueueLabel: "உங்கள் வரிசை எண்",
  rcThanks: "தயவுசெய்து அமருங்கள். உங்கள் எண் மருத்துவமனை திரையில் அழைக்கப்படும்.",
  rcSms: "SMS மூலம் அனுப்பு",
  rcPrint: "காகித சீட்டை அச்சிடு",
  rcDone: "முடிந்தது",
  rcAnnounce: `அனைத்தும் தயார். தலைப்பு நிலை 1. உங்கள் வரிசை எண் ${SESSION.queueNumber}. தயவுசெய்து அமர்ந்து மருத்துவமனை திரையைக் கவனியுங்கள். உங்கள் டிக்கெட்டை S M S மூலம் அனுப்ப அல்லது காகித சீட்டை அச்சிட Tab-ஐ அழுத்தவும்.`,

  tyTitle: "நன்றி",
  tySubtitle: "உங்கள் கட்டணம் முடிந்தது. இனிய நாள் அமையட்டும்.",
  tyAnnounce: "நன்றி. தலைப்பு நிலை 1. உங்கள் கட்டணம் முடிந்தது. இனிய நாள் அமையட்டும். அடுத்த நோயாளிக்கு மீண்டும் தொடங்க Tab-ஐ அழுத்தவும்.",
  tyFollowUpHeading: "உங்கள் தொடர் சந்திப்பு பதிவு செய்யப்பட்டது:",
  tySms: "SMS மூலம் அனுப்பு",
  tyPrint: "சீட்டை அச்சிடு",
  tySmsConfirm: `உங்கள் சந்திப்பு சீட்டு S M S மூலம் ${SESSION.mobile} க்கு அனுப்பப்படும்.`,
  tyPrintConfirm: "உங்கள் சந்திப்பு சீட்டு கீழே உள்ள அச்சுப்பொறியில் அச்சிடப்படுகிறது.",
};

const dict: Record<Lang, Copy> = { en, zh, ms, ta };

export const copyFor = (lang: Lang): Copy => dict[lang];

// Convert a displayed amount like "$45.00" or "-$39.00" into a spoken phrase in
// the active language ("45 dollars", "12 dollars 40 cents", "minus 39 dollars"),
// so no voice ever reads "$" as "US dollar".
// Expand display abbreviations so TTS reads dates naturally.
// "(Mon) · 8:05 AM" → "Monday at 8:05 AM"; "Jan" → "January", etc.
export const expandDateForSpeech = (date: string): string =>
  date
    .replace(/\(Mon\)/g, "Monday").replace(/\(Tue\)/g, "Tuesday").replace(/\(Wed\)/g, "Wednesday")
    .replace(/\(Thu\)/g, "Thursday").replace(/\(Fri\)/g, "Friday")
    .replace(/\(Sat\)/g, "Saturday").replace(/\(Sun\)/g, "Sunday")
    .replace(/\bJan\b/g, "January").replace(/\bFeb\b/g, "February").replace(/\bMar\b/g, "March")
    .replace(/\bApr\b/g, "April").replace(/\bJun\b/g, "June").replace(/\bJul\b/g, "July")
    .replace(/\bAug\b/g, "August").replace(/\bSep\b/g, "September").replace(/\bOct\b/g, "October")
    .replace(/\bNov\b/g, "November").replace(/\bDec\b/g, "December")
    .replace(/·/g, "at");

// "9123 1234" -> "9, 1, 2, 3, 1, 2, 3, 4" so TTS reads phone numbers digit by digit.
export const expandPhoneForSpeech = (phone: string): string =>
  phone.replace(/\D/g, "").split("").join(", ");

export const moneySpeech = (value: string, t: Copy): string => {
  const negative = value.trim().startsWith("-");
  const digits = value.replace(/[^0-9.]/g, "");
  const [whole, frac = ""] = digits.split(".");
  const dollars = parseInt(whole || "0", 10);
  const cents = parseInt((frac + "00").slice(0, 2), 10);
  let phrase = `${dollars} ${t.curDollar}`;
  if (cents > 0) phrase += ` ${cents} ${t.curCent}`;
  return negative ? `${t.curMinus} ${phrase}` : phrase;
};
