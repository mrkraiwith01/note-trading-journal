import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Download,
  RefreshCw,
  FileText,
  Brain,
  BarChart3,
  PieChart as PieChartIcon,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Percent,
  Award,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  PieChart,
  Pie,
} from 'recharts';

// Interface definitions
interface Trade {
  id: string;
  ticket?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  entryPrice: number;
  exitPrice: number;
  profit: number; // in USD (+/-)
  strategy: string;
  notes: string;
}

// Prepopulated MT5 trading data for realistic initial visuals including 22/05 and 23/05
const PREPOPULATED_TRADES: Trade[] = [
  {
    id: 't1',
    ticket: '74910283',
    date: '2026-05-14',
    time: '14:30',
    symbol: 'XAUUSD',
    type: 'SELL',
    lots: 0.4,
    entryPrice: 2362.10,
    exitPrice: 2365.25,
    profit: -126.00,
    strategy: 'MACD Cross',
    notes: 'เปิด Sell ตามตัดกันต่ำกว่าเส้นศูนย์ในไทม์เฟรม 15m แต่โดน Stop Hunt ลากกินในวันข่าวประกาศ',
  },
  {
    id: 't2',
    ticket: '74910299',
    date: '2026-05-15',
    time: '19:15',
    symbol: 'GBPUSD',
    type: 'BUY',
    lots: 0.5,
    entryPrice: 1.26800,
    exitPrice: 1.27150,
    profit: 175.00,
    strategy: 'Breakout',
    notes: 'ราคาทะลุ Trendline ขาลงขึ้นไป ทดสอบแนวต้านแล้วเด้งกลับแรง ปิดทำกำไรเมื่อชนเส้นเป้าหมาย',
  },
  {
    id: 't3',
    ticket: '74910312',
    date: '2026-05-18',
    time: '09:05',
    symbol: 'USDJPY',
    type: 'BUY',
    lots: 1.2,
    entryPrice: 155.12,
    exitPrice: 155.35,
    profit: 180.50,
    strategy: 'Support & Resistance',
    notes: 'ราคาร่วงแตะแนวรับเส้นสำคัญรายวัน มีสัญญานแท่งเทียน Bullish Engulfing จึงเข้า BUY ทำกำไรระยะสั้น',
  },
  {
    id: 't4',
    ticket: '74910325',
    date: '2026-05-18',
    time: '16:40',
    symbol: 'BTCUSD',
    type: 'BUY',
    lots: 0.1,
    entryPrice: 67120.00,
    exitPrice: 67540.00,
    profit: 42.00,
    strategy: 'FVG / SMC',
    notes: 'เก็บรอบสั้นตามทฤษฎีออเดอร์บล็อคและเติมเต็มช่องว่างราคา (FVG) ในกราฟระดับ 1 ชม.',
  },
  {
    id: 't5',
    ticket: '74910338',
    date: '2026-05-19',
    time: '10:10',
    symbol: 'XAUUSD',
    type: 'BUY',
    lots: 0.5,
    entryPrice: 2330.00,
    exitPrice: 2325.00,
    profit: -250.00,
    strategy: 'Price Action',
    notes: 'รีบร้อนสวนเทรนตรงแนวต้านย่อย หวังแท่งกลับตัวดักหน้า สุดท้ายราคาร่วงหลุดกรอบแนวต้านกลายเป็นแนวรับ',
  },
  {
    id: 't6',
    ticket: '74910352',
    date: '2026-05-20',
    time: '15:20',
    symbol: 'GBPUSD',
    type: 'SELL',
    lots: 0.8,
    entryPrice: 1.27420,
    exitPrice: 1.27650,
    profit: -184.00,
    strategy: 'MACD Cross',
    notes: 'หลงกลสัญญาณเทลลิ่ง สัญญาณตัดเส้นตัดไม่สมบูรณ์ แต่โดนแรงพยุงทางเศรษฐกิจดึงกลับ สึกหรอกดดันวินัย',
  },
  {
    id: 't7',
    ticket: '74910375',
    date: '2026-05-21',
    time: '21:00',
    symbol: 'XAUUSD',
    type: 'SELL',
    lots: 0.3,
    entryPrice: 2355.00,
    exitPrice: 2350.50,
    profit: 135.00,
    strategy: 'Support & Resistance',
    notes: 'ดักเข้าตรงขอบบนระยะไซด์เวย์รายชั่วโมง ราคาปฏิเสธแนวต้านชัดเจน วาง R:R ค่อนข้างคุ้มค่า',
  },
  {
    id: 't8',
    ticket: '74910405',
    date: '2026-05-22',
    time: '14:15',
    symbol: 'EURUSD',
    type: 'BUY',
    lots: 1.0,
    entryPrice: 1.08210,
    exitPrice: 1.08510,
    profit: 300.80,
    strategy: 'Breakout',
    notes: 'เกิดโมเมนตัมข่าวตัวเลขเศรษฐกิจคลาดเคลื่อนตามคาด ราคาทะลุกรอบวิ่งแรง ปล่อยรันเทรนเต็มพิกัด',
  },
  {
    id: 't9',
    ticket: '74910427',
    date: '2026-05-23',
    time: '11:30',
    symbol: 'XAUUSD',
    type: 'BUY',
    lots: 0.5,
    entryPrice: 2341.20,
    exitPrice: 2346.95,
    profit: 287.56,
    strategy: 'Price Action',
    notes: 'เทรดวันนี้ช่วงเช้า ราคาลงมารีเทสระดับ FVG ในแนวโน้มหลักขาขึ้น มีสัญญาณ Pin Bar ชัดเจน รีบพอร์ตกำไรทันที',
  },
];

export default function App() {
  // Local storage caching for user trades
  const [trades, setTrades] = useState<Trade[]>(() => {
    const cached = localStorage.getItem('forex_journal_trades');
    return cached ? JSON.parse(cached) : PREPOPULATED_TRADES;
  });

  const [initialDeposit, setInitialDeposit] = useState<number>(() => {
    const cached = localStorage.getItem('forex_journal_deposit');
    return cached ? parseFloat(cached) : 10000;
  });

  // UI States
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2026, 4, 1)); // May 2026 representation (0-indexed 4)
  const [showAddForm, setShowAddForm] = useState(false);
  const [mt5ImportText, setMt5ImportText] = useState('');
  const [showMt5Modal, setShowMt5Modal] = useState(false);
  const [syncingState, setSyncingState] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [activeDayTrades, setActiveDayTrades] = useState<{ date: string; trades: Trade[] } | null>(null);

  // Gemini states
  const [aiReport, setAiReport] = useState<string>(() => {
    return localStorage.getItem('forex_journal_ai_report') || '';
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Form State
  const [formSymbol, setFormSymbol] = useState('XAUUSD');
  const [formType, setFormType] = useState<'BUY' | 'SELL'>('BUY');
  const [formLots, setFormLots] = useState(0.1);
  const [formEntry, setFormEntry] = useState(2340.00);
  const [formExit, setFormExit] = useState(2345.00);
  const [formProfit, setFormProfit] = useState(50.00);
  const [formStrategy, setFormStrategy] = useState('Price Action');
  const [formNotes, setFormNotes] = useState('');
  const [formDate, setFormDate] = useState('2026-05-23');
  const [formTime, setFormTime] = useState('12:00');

  useEffect(() => {
    localStorage.setItem('forex_journal_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('forex_journal_deposit', initialDeposit.toString());
  }, [initialDeposit]);

  useEffect(() => {
    if (aiReport) {
      localStorage.setItem('forex_journal_ai_report', aiReport);
    } else {
      localStorage.removeItem('forex_journal_ai_report');
    }
  }, [aiReport]);

  // Statistics calculation helpers
  const totalTrades = trades.length;
  const netProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const currentBalance = initialDeposit + netProfit;
  
  const winningTrades = trades.filter((t) => t.profit > 0);
  const losingTrades = trades.filter((t) => t.profit <= 0);
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const totalWinningAmount = winningTrades.reduce((sum, t) => sum + t.profit, 0);
  const totalLosingAmount = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
  const profitFactor = totalLosingAmount > 0 ? totalWinningAmount / totalLosingAmount : totalWinningAmount > 0 ? 99.9 : 0;

  const avgWin = winningTrades.length > 0 ? totalWinningAmount / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLosingAmount / losingTrades.length : 0;
  const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

  // Group daily P/L for calendar styling
  const dailyProfitMap: Record<string, number> = {};
  trades.forEach((t) => {
    dailyProfitMap[t.date] = (dailyProfitMap[t.date] || 0) + t.profit;
  });

  // Calculate high drawdown or metrics for visual widgets
  const maxWin = winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.profit)) : 0;
  const maxLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.profit)) : 0;

  // Balance Equity Chart data processing
  const getEquityChartData = () => {
    // Sort trades chronologically
    const sortedTrades = [...trades].sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.time}`);
      const dtB = new Date(`${b.date}T${b.time}`);
      return dtA.getTime() - dtB.getTime();
    });

    let runningBalance = initialDeposit;
    const balancePoints = [{ index: 0, date: 'เริ่มต้น', balance: initialDeposit, profit: 0, symbol: '' }];

    sortedTrades.forEach((t, i) => {
      runningBalance += t.profit;
      balancePoints.push({
        index: i + 1,
        date: `${t.date.split('-')[2]}/${t.date.split('-')[1]}`,
        balance: parseFloat(runningBalance.toFixed(2)),
        profit: t.profit,
        symbol: t.symbol,
      });
    });

    return balancePoints;
  };

  const getPairPerformanceData = () => {
    const symbolMap: Record<string, { name: string; profit: number; wins: number; total: number }> = {};
    trades.forEach((t) => {
      if (!symbolMap[t.symbol]) {
        symbolMap[t.symbol] = { name: t.symbol, profit: 0, wins: 0, total: 0 };
      }
      symbolMap[t.symbol].profit += t.profit;
      symbolMap[t.symbol].total += 1;
      if (t.profit > 0) symbolMap[t.symbol].wins += 1;
    });

    return Object.values(symbolMap).map((item) => ({
      ...item,
      profit: parseFloat(item.profit.toFixed(2)),
      winRate: parseFloat(((item.wins / item.total) * 100).toFixed(1)),
    }));
  };

  const getStrategyPerformanceData = () => {
    const strategyMap: Record<string, { name: string; profit: number; total: number; wins: number }> = {};
    trades.forEach((t) => {
      const strat = t.strategy || 'ไม่ระบุ';
      if (!strategyMap[strat]) {
        strategyMap[strat] = { name: strat, profit: 0, total: 0, wins: 0 };
      }
      strategyMap[strat].profit += t.profit;
      strategyMap[strat].total += 1;
      if (t.profit > 0) strategyMap[strat].wins += 1;
    });

    return Object.values(strategyMap).map((item) => ({
      name: item.name,
      กำไรสุทธิ: parseFloat(item.profit.toFixed(2)),
      จำนวนไม้: item.total,
      อัตราชนะ: parseFloat(((item.wins / item.total) * 100).toFixed(1)),
    }));
  };

  // MT5 Automated Simulator Trigger
  const triggerMt5MockSync = () => {
    setSyncingState('syncing');
    setTimeout(() => {
      // Simulate fetching a bunch of MetaTrader 5 live trades
      const simulatedMT5Trades: Trade[] = [
        {
          id: 'mt5-7493810',
          ticket: '82910384',
          date: '2026-05-22',
          time: '18:50',
          symbol: 'EURUSD',
          type: 'BUY',
          lots: 1.0,
          entryPrice: 1.08210,
          exitPrice: 1.08510,
          profit: 300.80,
          strategy: 'MT5 Sync',
          notes: 'ซิงค์อัตโนมัติจากเซิร์ฟเวอร์โบรกเกอร์ MT5',
        },
        {
          id: 'mt5-7493811',
          ticket: '82910404',
          date: '2026-05-23',
          time: '11:15',
          symbol: 'XAUUSD',
          type: 'BUY',
          lots: 0.5,
          entryPrice: 2341.20,
          exitPrice: 2346.95,
          profit: 287.56,
          strategy: 'MT5 Sync',
          notes: 'ซิงค์อัตโนมัติจากเซิร์ฟเวอร์โบรกเกอร์ MT5',
        },
        {
          id: 'mt5-7493812',
          ticket: '82910450',
          date: '2026-05-23',
          time: '15:20',
          symbol: 'GBPUSD',
          type: 'SELL',
          lots: 0.5,
          entryPrice: 1.27200,
          exitPrice: 1.26950,
          profit: 125.00,
          strategy: 'MT5 Sync',
          notes: 'ซิงค์จากประวัติเทรด MT5 ประตูเชื่อมต่อโบรกเกอร์',
        },
      ];

      // Merge and make unique by Ticket to prevent duplicate imports
      setTrades((prev) => {
        const uniquePrev = prev.filter((t) => !t.ticket || !['82910384', '82910404', '82910450'].includes(t.ticket));
        return [...uniquePrev, ...simulatedMT5Trades];
      });
      setSyncingState('success');
      setTimeout(() => setSyncingState('idle'), 3000);
    }, 1500);
  };

  // Parser for pasted MT5 Statement Text reports
  const handleStatementPasteImport = () => {
    if (!mt5ImportText.trim()) return;

    const lines = mt5ImportText.split('\n');
    const imported: Trade[] = [];
    let linesParsedCount = 0;

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.toLowerCase().includes('ticket') || cleanLine.toLowerCase().includes('history')) return;

      // split by tabs or multiple spaces
      const tokens = cleanLine.split(/\t+|\s{2,}/);
      if (tokens.length >= 8) {
        try {
          // MT5 statements generally look like: Ticket Time Type Volume Symbol Price S/L T/P Close-Time Close-Price Profit
          const ticket = tokens[0];
          const typeStr = tokens[1]?.toUpperCase() || '';
          const symbolStr = tokens[2] || 'EURUSD';
          const type: 'BUY' | 'SELL' = typeStr.includes('SELL') ? 'SELL' : 'BUY';

          const lots = parseFloat(tokens[3]) || 0.1;
          const entryPrice = parseFloat(tokens[4]) || 1.0;

          // Attempt to parse out profit and close dates
          const dateToken = tokens[8] || tokens[7] || '2026.05.23 12:00';
          let date = '2026-05-23';
          let time = '12:00';
          if (dateToken.includes('.') || dateToken.includes('-')) {
            const splitDT = dateToken.replace(/\./g, '-').split(' ');
            date = splitDT[0];
            time = splitDT[1] || '12:00';
          }

          const exitPrice = parseFloat(tokens[9]) || entryPrice;
          const profit = parseFloat(tokens[tokens.length - 1]) || 0;

          imported.push({
            id: `imported-${ticket}-${Math.random().toString(36).substr(2, 4)}`,
            ticket,
            date,
            time,
            symbol: symbolStr.toUpperCase(),
            type,
            lots,
            entryPrice,
            exitPrice,
            profit,
            strategy: 'MT5 Report',
            notes: 'นำเข้าจากรายงานประวัติรายละเอียด MT5',
          });
          linesParsedCount++;
        } catch (e) {
          console.error('Error line parse:', e);
        }
      }
    });

    if (imported.length > 0) {
      setTrades((prev) => {
        // filter out elements with same ticket
        const existingTickets = new Set(prev.map((t) => t.ticket).filter(Boolean));
        const filteredImported = imported.filter((t) => !existingTickets.has(t.ticket));
        return [...prev, ...filteredImported];
      });
      alert(`นำเข้าสำเร็จ! พบรายการข้อมูลเทรดที่ตรงรูปแบบทั้งหมด ${imported.length} รายการ`);
      setMt5ImportText('');
      setShowMt5Modal(false);
    } else {
      alert('ไม่พบรูปแบบสากลของ MetaTrader 5 ในรายการเท็กซ์ของคุณ โปรดตรวจสอบแพทเทิร์นแนวเว้นวรรค');
    }
  };

  const loadSampleStatementText = () => {
    setMt5ImportText(
      `Ticket\tType\tSymbol\tVolume\tPrice\tS / L\tT / P\tClose Time\tPrice\tProfit\n` +
        `92810311\tbuy\tXAUUSD\t0.30\t2345.10\t2340.00\t2360.00\t2026.05.22 10:15\t2351.60\t195.00\n` +
        `92810345\tsell\tEURUSD\t1.50\t1.08420\t1.08800\t1.07900\t2026.05.22 17:30\t1.08210\t315.00\n` +
        `92810388\tbuy\tXAUUSD\t0.40\t2339.20\t2335.00\t2355.00\t2026.05.23 15:40\t2342.15\t118.00\n` +
        `92810421\tsell\tGBPUSD\t1.00\t1.27500\t1.27900\t1.27000\t2026.05.23 20:10\t1.27780\t-280.00`
    );
  };

  // Manual Add Trade Submit
  const handleAddNewTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
      id: `manual-${Date.now()}`,
      symbol: formSymbol.toUpperCase().trim(),
      type: formType,
      lots: Number(formLots),
      entryPrice: Number(formEntry),
      exitPrice: Number(formExit),
      profit: Number(formProfit),
      strategy: formStrategy,
      notes: formNotes || 'บันทึกส่วนตัว',
      date: formDate,
      time: formTime,
    };

    setTrades((prev) => [newTrade, ...prev]);
    setShowAddForm(false);
    setFormNotes('');
  };

  // Delete trade
  const handleDeleteTrade = (id: string) => {
    if (confirm('ยืนยันรบกวนข้อมูลการเทรดนี้จากสมุดบันทึก?')) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
      if (activeDayTrades) {
        const remaining = activeDayTrades.trades.filter((t) => t.id !== id);
        if (remaining.length === 0) {
          setActiveDayTrades(null);
        } else {
          setActiveDayTrades({ ...activeDayTrades, trades: remaining });
        }
      }
    }
  };

  const handleClearAllTrades = () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลเทรดทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      setTrades([]);
      localStorage.removeItem('forex_journal_trades');
      setAiReport('');
    }
  };

  const handleResetToPrepopulate = () => {
    if (confirm('ต้องการคืนค่าข้อมูลตั้งต้นในประวัติ (รวมถึงตัวอย่างวันที่ 22 และ 23 พ.ค.) หรือไม่?')) {
      setTrades(PREPOPULATED_TRADES);
      setInitialDeposit(10000);
      setAiReport('');
    }
  };

  // Gemini AI Analysis triggering
  const fetchAiAnalysis = async () => {
    if (trades.length === 0) {
      setAiError('โปรดป้อนหรือซิงค์ข้อมูลการเทรดอย่างน้อย 1 รายการเพื่อตรวจสอบความถูกต้อง');
      return;
    }

    setAiLoading(true);
    setAiError('');

    // Formulate a structured trading review prompt for Gemini
    const tradesSummary = trades.map((t) => (
      `- วันที่: ${t.date} | คู่: ${t.symbol} | ขา: ${t.type} | Lots: ${t.lots} | กำไร/ขาดทุน: $${t.profit} | กลยุทธ์: ${t.strategy} | บันทึก: ${t.notes}`
    )).join('\n');

    const promptText = `นี่คือรายการประวัติการเทรด Forex ล่าสุดในบันทึกส่วนตัวของฉัน:\n\n${tradesSummary}\n\nสถิติตัวเลขเพิ่มเติม:\n- จำนวนไม้ทั้งหมด: ${totalTrades}\n- กำไรสุทธิรวม: $${netProfit.toFixed(2)}\n- อัตราการชนะ (Win Rate): ${winRate.toFixed(1)}%\n- อัตราผลตอบแทนคาดหวัง (Profit Factor): ${profitFactor.toFixed(2)}\n- ค่าเฉลี่ยการชนะเทียบการแพ้ (Avg Win/Loss Ratio): ${riskRewardRatio.toFixed(2)}\n\nกรุณาวิเคราะห์จุดเด่น (เช่น คู่ที่เทรดได้ดี กลยุทธ์ที่ทำกำไร) จุดด้อยที่สะท้อนถึงอารมณ์หรือจิตวิทยาการเทรดที่ต้องปรับปรุง และเขียนให้คำแนะนำการแก้ปัญหาการวาง Money Management เชิงปฏิบัติการ 3 ข้อ เพื่อยกระดับความสามารถในการผลิตกำไรรายสัปดาห์ เขียนคำแนะนำในรูปแบบ Markdown ภาษาไทยที่น่าอ่าน สรุปรวบยอด สั้นและเป็นประโยชน์โดยตรง`;

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setAiReport(data.text);
      } else {
        setAiError(data.error || 'ไม่สามารถรับข้อมูลผลวิเคราะห์จาก AI กรุณาตรวจสอบ Key ใน Secrets');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('เครือข่ายขัดข้อง กรุณาลองใหม่อีกครั้งภายหลัง');
    } finally {
      setAiLoading(false);
    }
  };

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfWeek = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const renderCalendar = () => {
    const totalDays = daysInMonth(selectedMonth);
    const startOffset = startDayOfWeek(selectedMonth);
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const calendarCells = [];

    // Prepend empty cells for alignment
    for (let i = 0; i < startOffset; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="bg-slate-900/10 border border-slate-900/40 min-h-[90px] rounded-lg opacity-30 w-[45.8438px] text-[9px]" />);
    }

    // Populate actual month days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTrades = trades.filter((t) => t.date === dateStr);
      const dayProfit = dayTrades.reduce((sum, t) => sum + t.profit, 0);

      let dayBg = 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-800/50';
      let profitColorClass = 'text-slate-400';
      let hasTrades = dayTrades.length > 0;

      if (hasTrades) {
        if (dayProfit > 0) {
          dayBg = 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-950/60 transition-colors cursor-pointer';
          profitColorClass = 'text-emerald-400 font-semibold drop-shadow';
        } else {
          dayBg = 'bg-rose-950/40 border-rose-500/30 hover:bg-rose-950/60 transition-colors cursor-pointer';
          profitColorClass = 'text-rose-400 font-semibold drop-shadow';
        }
      }

      calendarCells.push(
        <div
          key={`day-${day}`}
          id={`day-cell-${day}`}
          onClick={() => {
            if (hasTrades) {
              setActiveDayTrades({ date: dateStr, trades: dayTrades });
            } else {
              // open add form on this day
              setFormDate(dateStr);
              setShowAddForm(true);
            }
          }}
          className={`border p-2 rounded-lg flex flex-col justify-between min-h-[90px] w-[45.8438px] text-[9px] ${dayBg}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs ${hasTrades ? 'font-bold' : 'text-slate-400'}`}>{day}</span>
            {hasTrades && (
              <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-1.5 py-0.5 rounded-full">
                {dayTrades.length} ไม้
              </span>
            )}
          </div>
          {hasTrades && (
            <div className="text-right mt-2 text-xs">
              <span className={`${profitColorClass} text-[9px] ml-[-5px]`}>
                {dayProfit >= 0 ? '+' : ''}
                {dayProfit.toFixed(2)}$
              </span>
            </div>
          )}
        </div>
      );
    }

    // Append cells to fill grid row
    const totalGridItems = calendarCells.length;
    const remainingEmptyCells = (7 - (totalGridItems % 7)) % 7;
    for (let i = 0; i < remainingEmptyCells; i++) {
      calendarCells.push(<div key={`end-empty-${i}`} className="bg-slate-900/10 border border-slate-900/20 min-h-[90px] rounded-lg opacity-30 w-[45.8438px] text-[9px]" />);
    }

    return calendarCells;
  };

  const chartData = getEquityChartData();
  const pairData = getPairPerformanceData();
  const strategyData = getStrategyPerformanceData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 font-sans flex flex-col gap-6 select-none" id="app-container">
      {/* HEADER BAR */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4" id="app-header">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-emerald-500/10 animate-pulse">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Forex Trading Journal & Analytics
              </h1>
              <p className="text-xs text-slate-400">
                ระบบวิเคราะห์ประวัติการเทรดด้วยกราฟและกลยุทธ์อัจฉริยะ ซิงค์ MetaTrader 5 พร้อมพลังประมวลผล AI
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            id="mt5-sync-api-btn"
            onClick={triggerMt5MockSync}
            disabled={syncingState === 'syncing'}
            className="flex-1 md:flex-initial py-2 px-3.5 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingState === 'syncing' ? 'animate-spin text-emerald-400' : ''}`} />
            {syncingState === 'syncing' ? 'ดึงข้อมูลพอร์ต...' : syncingState === 'success' ? 'ซิงค์เข้าเรียบร้อย!' : 'ซิงค์ด่วนบัญชี MT5'}
          </button>

          <button
            id="mt5-file-modal-btn"
            onClick={() => setShowMt5Modal(true)}
            className="flex-1 md:flex-initial py-2 px-3.5 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 text-indigo-300 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            นำเข้าเท็กซ์รายงาน MT5
          </button>

          <button
            id="journal-add-btn"
            onClick={() => {
              setFormDate(new Date().toISOString().split('T')[0]);
              setShowAddForm(true);
            }}
            className="flex-1 md:flex-initial py-2 px-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-xs font-black rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            จดประวัติคำสั่งใหม่
          </button>
        </div>
      </header>

      {/* METRIC CARDS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-strip">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between" id="metric-card-balance">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-slate-500" /> บัญชีเงินทุนสุทธิ
            </span>
            <span className="text-lg md:text-2xl font-black text-white mt-1">
              ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              เงินเริ่มต้น: 
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-slate-400 border-none underline font-semibold focus:outline-none w-16 px-1"
              />
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-755/50">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between" id="metric-card-netprofit">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              วิเคราะห์กำไรขาดทุนสะสม
            </span>
            <span className={`text-lg md:text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netProfit >= 0 ? '+' : ''}
              ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              สตรีคจำนวนรวม: <strong className="text-slate-200">{totalTrades} ไม้</strong>
            </span>
          </div>
          <div className={`p-2.5 rounded-lg border ${netProfit >= 0 ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-rose-950/40 border-rose-500/20 text-rose-400'}`}>
            <Award className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between" id="metric-card-winrate">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-slate-500" /> อัตราการชนะ (Win Rate)
            </span>
            <span className="text-lg md:text-2xl font-black text-white mt-1">
              {winRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 flex gap-1">
              ชนะ <span className="text-emerald-400 font-bold">{winningTrades.length}</span> / แพ้ <span className="text-rose-400 font-bold">{losingTrades.length}</span>
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg text-slate-400">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between" id="metric-card-profitfactor">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              Profit Factor / Risk:Reward
            </span>
            <span className="text-lg md:text-2xl font-black text-white mt-1">
              {profitFactor.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 flex gap-1 items-center">
              สัดส่วน R:R เฉลี่ย: <strong className="text-indigo-300">{riskRewardRatio.toFixed(2)}</strong>
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg text-slate-400">
            <HelpCircle className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </section>

      {/* BENTO GRID: INTERACTIVE CALENDAR & ADVANCED PORTAL */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="bento-grid-area">
        {/* INTERACTIVE TRADE CALENDAR PANEL (60%) */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-850 p-4 lg:p-5 rounded-2xl flex flex-col justify-between" id="bento-panel-calendar">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-base font-bold text-slate-100">
                    ตารางปฏิทินกำไร/ขาดทุนสะสมรายวัน
                  </h2>
                  <p className="text-xs text-slate-400">
                    คลิกแต่ละวันที่ต้องการเพื่อดูรายละเอียดไม้หรือเพิ่มรายการเทรด
                  </p>
                </div>
              </div>

              {/* Calendar Navigator */}
              <div className="flex items-center gap-2">
                <button
                  id="calendar-prev-month-btn"
                  onClick={handlePrevMonth}
                  className="p-1 text-slate-400 hover:text-slate-150 border border-slate-800 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-200 min-w-[100px] text-center">
                  {thaiMonths[selectedMonth.getMonth()]} {selectedMonth.getFullYear() + 543}
                </span>
                <button
                  id="calendar-next-month-btn"
                  onClick={handleNextMonth}
                  className="p-1 text-slate-400 hover:text-slate-150 border border-slate-800 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid Header (Weeks) */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black tracking-wider text-slate-500 mb-1.5 uppercase">
              <div>อา</div>
              <div>จ</div>
              <div>อ</div>
              <div>พ</div>
              <div>พฤ</div>
              <div>ศ</div>
              <div>ส</div>
            </div>

            {/* Calendar Rows Grid */}
            <div className="grid grid-cols-7 gap-1.5" id="calendar-days-grid">
              {renderCalendar()}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-850 flex flex-wrap justify-between items-center text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded" />
              <span>วันที่กำไรสุทธิเป็นบวก (+)</span>
              <span className="inline-block w-2.5 h-2.5 bg-rose-950/40 border border-rose-500/30 rounded ml-2" />
              <span>วันที่กำไรสุทธิเป็นลบ (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">หมายเหตุ: ปีปฏิทิน ค.ศ. 2026 ตามวันที่ความเจริญเติบโตปัจจุบัน</span>
            </div>
          </div>
        </div>

        {/* AI TRADE COACH & MT5 PORTAL PANEL (40%) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="bento-panel-coach-portal">
          {/* GEMINI AI ANALYTICS ADVISOR */}
          <div className="bg-slate-900/30 border border-slate-850 p-4 lg:p-5 rounded-2xl flex-1 flex flex-col justify-between" id="coach-ai-subpanel">
            <div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                    <Brain className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-100">
                      Gemini AI โค้ชวิเคราะห์กลยุทธ์
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      ประมวลผลข้อบกพร่อง วินัย และสร้างแผนพัฒนาส่วนตัว
                    </p>
                  </div>
                </div>
              </div>

              {aiLoading ? (
                <div className="flex flex-col items-center justify-center p-8 gap-3" id="ai-loading-skeleton">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs text-slate-300 font-medium">กำลังอ่านประวัติเทรดและสร้างผลวิเคราะห์ชิ้นเด็ด...</p>
                  <p className="text-[10px] text-slate-500 text-center">ใช้ประสาทตรรกะประมวลพฤติกรรมการเทรดแบบองค์รวม</p>
                </div>
              ) : aiError ? (
                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 mb-4" id="ai-error-indicator">
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <div>
                      <p className="font-bold">ระบบขัดข้อง!</p>
                      <p className="mt-1 text-[11px] text-slate-400">{aiError}</p>
                    </div>
                  </div>
                </div>
              ) : aiReport ? (
                <div className="max-h-[300px] overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed mb-4 scrollbar-thin scrollbar-thumb-slate-800" id="ai-report-box">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 mb-3 text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> วิเคราะห์ด้วยความลึกซึ้งตามสถิติของพอร์ตเทรดเรียบร้อย
                  </div>
                  <div className="prose prose-invert prose-xs text-[11px]" dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br />') }} />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400" id="ai-fallback-view">
                  <div className="inline-block p-3 bg-slate-950/30 rounded-full mb-3 text-slate-500">
                    <Brain className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-semibold">ยังไม่มีรายงานคำวิจารณ์ทางการเทรด</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[240px] mx-auto">
                    คลิกวิเคราะห์ด้านล่างเพื่อส่งข้อมูลประวัติสถิติให้สมองกล AI แตกกลยุทธ์ทำเงิน
                  </p>
                </div>
              )}
            </div>

            <button
              id="ai-trigger-analysis-btn"
              onClick={fetchAiAnalysis}
              disabled={aiLoading || trades.length === 0}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              วิเคราะห์สไตล์เทรดด้วย Gemini AI
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED GRAPHS & VISUAL ANALYTICS (RECHARTS) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="graphs-analytics-section">
        {/* EQUITY BALANCE CURVE */}
        <div className="bg-slate-900/30 border border-slate-850 p-4 lg:p-5 rounded-2xl" id="analytics-panel-equity">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> เส้นระดับเงินทุนสะสม (Equity Balance Curve)
            </h2>
            <p className="text-[10px] text-slate-400">กราฟเส้นแสดงการเติบโตขึ้นลงของพอร์ตผ่านช่วงการสวิงตัวแปรเทรด</p>
          </div>

          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '10px', color: '#94a3b8' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" name="ยอดพอร์ต ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Mini Stats List */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t border-slate-850 pt-3">
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-850/50">
              <p className="text-[9px] text-slate-500 uppercase font-black">ผลรวมชัยชนะสุทธิสุด</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">${maxWin.toFixed(2)}</p>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-850/50">
              <p className="text-[9px] text-slate-500 uppercase font-black">ตกขบวนเสียสุด</p>
              <p className="text-xs font-bold text-rose-400 mt-0.5">${maxLoss.toFixed(2)}</p>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-850/50">
              <p className="text-[9px] text-slate-500 uppercase font-black">เป้าหมายกำไรเฉลี่ยไม้</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5">${avgWin.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* STRATEGIES & PAIR STATISTCS */}
        <div className="bg-slate-900/30 border border-slate-850 p-4 lg:p-5 rounded-2xl flex flex-col justify-between" id="analytics-panel-breakdown">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> ประสิทธิภาพการแบ่งตามกลยุทธ์ส่วนตัว
                </h2>
                <p className="text-[10px] text-slate-400">ภาพจำแนกว่ากลยุทธ์ไหนที่ดึงพอร์ตได้กำไรสูงที่น่าคบค้าสมาคม</p>
              </div>
            </div>

            {strategyData.length === 0 ? (
              <div className="text-center p-10 text-slate-500 text-xs">ป้อนผลรายการเพื่อสร้างกราฟกลยุทธ์</div>
            ) : (
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strategyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="กำไรสุทธิ" fill="#10b981" radius={[4, 4, 0, 0]}>
                      {strategyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.กำไรสุทธิ >= 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pair performance small overview row */}
          <div className="border-t border-slate-850 pt-3 mt-3">
            <h3 className="text-xs font-bold text-slate-300 mb-2">อัตราความแม่นแยกตามเครื่องมือคู่เงิน:</h3>
            <div className="flex flex-wrap gap-2">
              {pairData.map((p) => (
                <div key={p.name} className="bg-slate-950/60 border border-slate-850 px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-slate-100">{p.name}</span>
                  <span className={`font-semibold ${p.profit >= 0 ? 'text-emerald-400' : 'text-rose-450'}`}>
                    {p.profit >= 0 ? '+' : ''}${p.profit}
                  </span>
                  <span className="text-[9px] bg-indigo-950/50 text-indigo-300 font-bold px-1 rounded">
                    ชนะ {p.winRate}% (ทั้งหมด {p.total} ไม้)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED HISTORY LOGS */}
      <section className="bg-slate-900/10 border border-slate-850 p-4 lg:p-5 rounded-2xl flex flex-col gap-4" id="history-logs-section">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="text-indigo-400 w-5 h-5" /> สมุดจดและบันทึกวิจารณ์ประวัติเทรด Forex
            </h2>
            <p className="text-xs text-slate-400">รายการเรียงลำดับใหม่สุด ตรวจดูคำจดประวัติการเทรด แร่เงิน และพฤติกรรม</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              id="clear-all-trades-btn"
              onClick={handleClearAllTrades}
              className="px-2.5 py-1.5 bg-rose-955/20 hover:bg-rose-900/30 text-rose-400 border border-rose-900/40 text-[10px] uppercase font-black rounded-lg transition-all cursor-pointer"
            >
              ลบทิ้งไม้ทั้งหมด
            </button>
            <button
              id="reset-prepopulate-btn"
              onClick={handleResetToPrepopulate}
              className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] uppercase font-black rounded-lg transition-all cursor-pointer"
            >
              ดึงสถิติตัวอย่างกลับมา
            </button>
          </div>
        </div>

        {trades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-slate-605" />
            <div>
              <p className="font-bold">ไม่มีประวัติการบันทึกการเทรดในขณะนี้</p>
              <p className="text-xs text-slate-500 mt-1">เริ่มต้นโดยการคลิกดัก "จดประวัติคำสั่งใหม่" หรือ "ซิงค์ด่วนบัญชี MT5"</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto" id="trade-history-table-container">
            <table className="w-full text-left border-collapse text-xs" id="trade-history-table">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-extrabold text-[10px] uppercase">
                  <th className="py-2.5 px-3">Ticket</th>
                  <th className="py-2.5 px-3">วัน-เวลา</th>
                  <th className="py-2.5 px-3">คู่เงิน/ดัชนี</th>
                  <th className="py-2.5 px-3 text-center">ประเภท</th>
                  <th className="py-2.5 px-3 text-center">Lots</th>
                  <th className="py-2.5 px-3 text-right">ราคาเข้า/ออก</th>
                  <th className="py-2.5 px-3 text-center">กลยุทธ์</th>
                  <th className="py-2.5 px-3">บันทึกวิจารณ์อารมณ์</th>
                  <th className="py-2.5 px-3 text-right">กำไร ($)</th>
                  <th className="py-2.5 px-3 text-center">ลบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors" id={`trade-row-${t.id}`}>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[10px]">{t.ticket || 'MANUAL'}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-300">
                      {t.date.split('-')[2]}/{t.date.split('-')[1]} <span className="text-slate-500">{t.time}</span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-white text-[11px]">{t.symbol}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${t.type === 'BUY' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60' : 'bg-rose-950/60 text-rose-400 border border-rose-900/60'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-100">{t.lots.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap text-[10px] font-mono text-slate-300">
                      {t.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} →{' '}
                      {t.exitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-slate-800/80 text-[10px] text-slate-300 font-semibold px-2 py-0.5 rounded-md border border-slate-700/50">
                        {t.strategy}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate text-[11px]">{t.notes}</td>
                    <td className={`py-3 px-3 text-right font-black text-xs ${t.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.profit >= 0 ? '+' : ''}${t.profit.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        id={`delete-btn-${t.id}`}
                        onClick={() => handleDeleteTrade(t.id)}
                        className="text-slate-500 hover:text-rose-450 p-1 rounded hover:bg-slate-850/65 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* POPUP: DETAILED TRADES ON DIRECT CLICKED CALENDAR DAY */}
      {activeDayTrades && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="calendar-day-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-indigo-400 w-5 h-5 animate-bounce" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    รายละเอียดคำสั่งเทรดวันที่ {activeDayTrades.date.split('-')[2]}/{activeDayTrades.date.split('-')[1]}/{activeDayTrades.date.split('-')[0]}
                  </h3>
                  <p className="text-[10px] text-slate-400">สรุปกำไรสะสมและบันทึกอารมณ์จากประวัติที่เปิดเทรดในวันนี้</p>
                </div>
              </div>
              <button
                id="close-calendar-modal-btn"
                onClick={() => setActiveDayTrades(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[450px] overflow-y-auto" id="calendar-modal-content">
              {/* Daily metric row */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-black">จำนวนคำสั่งทั้งหมด</p>
                  <p className="text-lg font-black text-white mt-0.5">{activeDayTrades.trades.length} ออเดอร์</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-black">ผลรวมLots</p>
                  <p className="text-lg font-black text-indigo-400 mt-0.5">
                    {activeDayTrades.trades.reduce((sum, t) => sum + t.lots, 0).toFixed(2)} Vol
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-black">กำไรสุทธิวันนี้</p>
                  <p className={`text-lg font-black mt-0.5 ${activeDayTrades.trades.reduce((sum, t) => sum + t.profit, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeDayTrades.trades.reduce((sum, t) => sum + t.profit, 0) >= 0 ? '+' : ''}
                    ${activeDayTrades.trades.reduce((sum, t) => sum + t.profit, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Table of today's trades */}
              <div className="flex flex-col gap-3">
                {activeDayTrades.trades.map((t) => (
                  <div key={t.id} className="bg-slate-950/25 border border-slate-850 p-3.5 rounded-xl hover:border-slate-700/60 transition-all flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{t.symbol}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded ${t.type === 'BUY' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/65' : 'bg-rose-950/50 text-rose-400 border border-rose-900/65'}`}>
                          {t.type} Lots {t.lots.toFixed(2)}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded">{t.strategy}</span>
                      </div>
                      <span className={`text-sm font-extrabold ${t.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.profit >= 0 ? '+' : ''}${t.profit.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 text-[10px] text-slate-400 py-1.5 border-y border-slate-850/50 font-mono">
                      <div>ราคาเข้า: <span className="text-slate-200 font-bold">{t.entryPrice.toFixed(2)}</span></div>
                      <div>ราคาออก: <span className="text-slate-200 font-bold">{t.exitPrice.toFixed(2)}</span></div>
                    </div>

                    <div className="text-xs text-slate-350">
                      <strong>บันทึกอารมณ์/วินัย:</strong> {t.notes}
                    </div>

                    <div className="flex justify-end mt-1">
                      <button
                        onClick={() => handleDeleteTrade(t.id)}
                        className="text-xs text-rose-400 hover:text-rose-350 flex items-center gap-1.5 hover:bg-rose-950/20 px-2 py-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> ลบคำสั่งนี้
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex justify-end">
              <button
                id="close-calendar-modal-footer-btn"
                onClick={() => setActiveDayTrades(null)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 rounded-lg cursor-pointer"
              >
                เสร็จสิ้น ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: MANUAL ADD TRADE DIALOG */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans" id="manual-add-modal">
          <form
            onSubmit={handleAddNewTrade}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-emerald-400 w-5 h-5" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">จดประวัติคำสั่งเทรด Forex ใหม่ (จดมือ)</h3>
                  <p className="text-[10px] text-slate-400">กรอกค่าการเทรดและบันทึกอารมณ์เพื่อการพัฒนาระบบวินัยระยะยาว</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">วันที่ทำรายการ</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">เวลาปิดจริง</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">เครื่องมือคู่เงิน</label>
                  <select
                    value={formSymbol}
                    onChange={(e) => setFormSymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="XAUUSD">XAUUSD (ทองคำ)</option>
                    <option value="EURUSD">EURUSD</option>
                    <option value="GBPUSD">GBPUSD</option>
                    <option value="USDJPY">USDJPY</option>
                    <option value="BTCUSD">BTCUSD</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">ประเภทออเดอร์</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">ขนาดสัญญา (Lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formLots}
                    onChange={(e) => setFormLots(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">ราคาจุดเข้าซื้อ</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={formEntry}
                    onChange={(e) => setFormEntry(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">ราคาปิดไม้ทำกำไร</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={formExit}
                    onChange={(e) => setFormExit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">กำไรสุทธิสุทธิ ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formProfit}
                    onChange={(e) => setFormProfit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase">กลยุทธ์ตามแผน</label>
                <select
                  value={formStrategy}
                  onChange={(e) => setFormStrategy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Price Action">Price Action (รูปทรงแท่งเทียน)</option>
                  <option value="Support & Resistance">Support & Resistance (แนวรับ-แนวต้าน)</option>
                  <option value="Breakout">Breakout (ฝ่าทะลุกรอบระดับ)</option>
                  <option value="MACD Cross">MACD Cross (สัญญาณอินดิเคเตอร์)</option>
                  <option value="FVG / SMC">FVG / SMC (อุปสงค์อุปทานและสุญญากาศของราคา)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase">ความล้มเหลว หรือ อารมณ์ในไม้เทรดนี้ (Journal Notes)</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="เช่น เข้าก่อนแผนตื่นตระหนกข่าว, มีวินัยตามแนว R:R ได้รอบสมบูรณ์...."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 rounded-lg cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="py-1.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold rounded-lg hover:brightness-110 cursor-pointer"
              >
                บันทึกลงสมุด
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP: MT5 STATEMENT IMPORT MODAL */}
      {showMt5Modal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans" id="mt5-paste-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="text-indigo-400 w-5 h-5" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">วางเท็กซ์รายงานประวัติ MetaTrader 5 (Detailed HTML)</h3>
                  <p className="text-[10px] text-slate-400">คัดลอกตารางประวัติจากรายงาน MT5 ของคุณมาวางลงในพื้นที่ด้านล่าง</p>
                </div>
              </div>
              <button
                onClick={() => setShowMt5Modal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-850 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                คัดลอกข้อความเป็นตาราง (เช่น คัดลอกแถวตารางจากแอป MT5 บนเครื่องคอมพิวเตอร์ของคุณ) หรือวางตัวอย่างสำเร็จด้านล่างเพื่อทดสอบ
              </p>

              <textarea
                rows={10}
                value={mt5ImportText}
                onChange={(e) => setMt5ImportText(e.target.value)}
                placeholder="Ticket	Type	Symbol	Volume	Price	S / L	T / P..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-white focus:border-indigo-500 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={loadSampleStatementText}
                  className="py-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] font-bold text-slate-300 rounded border border-slate-700 cursor-pointer"
                >
                  ลองวางตัวอย่างรายงาน MT5
                </button>
              </div>
            </div>

            <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowMt5Modal(false)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 rounded-lg cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleStatementPasteImport}
                className="py-1.5 px-5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                นำเข้าประวัติเทรด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
