import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Briefcase,
  Quote,
  Settings,
  ShieldCheck,
  Filter,
  X,
  Key,
  ExternalLink,
  Clock,
  Globe,
  Layers,
  Search,
  Landmark,
  Download,
  Zap,
  RotateCcw,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Extracted Components (防止重新渲染闪烁) ---

const QuoteSection = ({ dailyQuote, onRefresh }) => (
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 rounded-lg border border-yellow-900/20 relative overflow-hidden mb-8 shadow-lg group">
    <div className="absolute top-0 right-0 text-yellow-900/10 -mt-2 -mr-2 transition-transform group-hover:scale-110 duration-700">
      <Quote size={80} />
    </div>
    
    <div className="relative z-10 min-h-[80px] flex flex-col justify-center">
      {dailyQuote.loading ? (
         <div className="flex items-center gap-2 text-neutral-500 animate-pulse">
           <RefreshCw size={16} className="animate-spin" />
           <span className="text-sm font-serif italic">正在寻找大师智慧...</span>
         </div>
      ) : (
        <>
          <p className="text-neutral-300 text-base italic font-serif leading-relaxed tracking-wide animate-fade-in">
            "{dailyQuote.text}"
          </p>
          <div className="flex items-center justify-between mt-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onRefresh(); }}
              className="text-neutral-700 hover:text-yellow-600 transition-colors p-1 rounded-full hover:bg-neutral-800"
              title="刷新名言"
            >
              <RotateCcw size={14} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-8 bg-yellow-700/50"></div>
              <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest">{dailyQuote.author}</p>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

const NewsCard = ({ item }) => {
  const isBullish = item.sentiment === 'bullish';
  const isBearish = item.sentiment === 'bearish';
  const isIndustry = item.type === '行业';
  const isPolicy = item.type === '政策';
  const isFresh = item.is_fresh === true; 
  
  const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(item.stock + " " + item.summary.substring(0, 20))}`;
  const targetUrl = (item.url && item.url.startsWith('http')) ? item.url : fallbackUrl;
  const isFallback = targetUrl === fallbackUrl;

  const stockParts = item.stock.split(' ');
  const stockCode = stockParts[0] || item.stock;
  const stockName = stockParts.length > 1 ? stockParts.slice(1).join(' ') : '';

  return (
    <div className={`bg-neutral-900/80 border-t border-r border-b border-neutral-800 p-5 rounded-r-xl mb-6 relative overflow-hidden flex flex-col gap-4 shadow-md backdrop-blur-sm ${
      isPolicy 
        ? 'border-l-4 border-l-purple-500' 
        : (isFresh ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-neutral-700')
    }`}>
      <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
         <ShieldCheck size={80} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10 pb-3 border-b border-neutral-800/50">
        <div className="flex items-start gap-4">
          <div className="flex flex-col">
              <span className="text-yellow-500 font-bold text-base leading-none mb-1">
                  {stockName || stockCode}
              </span>
              {stockName && (
                  <span className="text-neutral-500 font-mono text-[10px] tracking-wider">
                      {stockCode}
                  </span>
              )}
          </div>
          
          <div className="flex flex-col gap-1 mt-0.5">
              {isPolicy && (
              <span className="text-purple-400 font-bold text-[10px] bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 flex items-center gap-1 w-fit">
                  <Landmark size={10} /> 政策
              </span>
              )}
              {isIndustry && (
              <span className="text-blue-400 font-bold text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-1 w-fit">
                  <Layers size={10} /> 行业
              </span>
              )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
           {isBullish && (
              <div className="flex items-center gap-1 text-red-400 bg-red-950/20 px-2 py-0.5 rounded text-xs font-bold border border-red-900/30">
              <TrendingUp size={12} />
              <span>利好</span>
              </div>
          )}
          {isBearish && (
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded text-xs font-bold border border-emerald-900/30">
              <TrendingDown size={12} />
              <span>利空</span>
              </div>
          )}
          {!isBullish && !isBearish && (
              <div className="flex items-center gap-1 text-neutral-400 bg-neutral-800/50 px-2 py-0.5 rounded text-xs font-bold border border-neutral-700">
              <Briefcase size={12} />
              <span>中性</span>
              </div>
          )}
          
          <div className={`flex items-center text-[10px] gap-1 ${isFresh ? 'text-orange-400/90' : 'text-neutral-600'}`}>
              {isFresh ? <Zap size={10} /> : <Clock size={10} />}
              <span>{item.time}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
          <p className="text-gray-300 text-[15px] leading-7 font-normal text-justify">
          {item.summary}
          </p>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col gap-2 relative z-10 mt-1">
          <div className={`rounded-lg px-3 py-2 border flex gap-2 items-start ${
            isPolicy 
              ? 'bg-purple-950/10 border-purple-900/20' 
              : 'bg-neutral-950/40 border-neutral-800/50'
          }`}>
              <Filter size={14} className={`mt-0.5 shrink-0 ${isPolicy ? "text-purple-500" : "text-yellow-600"}`} />
              <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isPolicy ? 'text-purple-500/70' : 'text-yellow-700/70'}`}>
                      {isPolicy ? "Policy Impact" : "Investment Logic"}
                  </span>
                  <p className="text-neutral-400 text-xs italic leading-relaxed">
                      {item.reason}
                  </p>
              </div>
          </div>

          <a 
              href={targetUrl} 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center justify-between group/link px-3 py-2 rounded-lg border transition-all ${
                isFallback 
                  ? "bg-neutral-800/30 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300" 
                  : "bg-blue-950/5 border-blue-900/10 text-blue-400/60 hover:bg-blue-900/10 hover:text-blue-300 hover:border-blue-900/30"
              }`}
              data-html2canvas-ignore="true" 
          >
              <div className="flex items-center gap-2">
                  {isFallback ? <Search size={12} /> : <Globe size={12} />}
                  <span className="text-xs font-medium">{item.source || "来源未知"}</span>
              </div>
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
      </div>
    </div>
  );
};

// --- Main Component ---

const ValueMoat = () => {
  // --- State Management ---
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vm_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [stockInput, setStockInput] = useState('');
  
  // 升级：Stocks 状态现在存储对象 { name: string, date: string }
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('vm_stocks');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // 数据迁移逻辑：如果发现旧数据是字符串数组，自动转换为对象格式
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map(s => ({
          name: s,
          date: new Date().toLocaleDateString() // 默认为当天
        }));
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // 每日名言 State
  const [dailyQuote, setDailyQuote] = useState({
    text: "我们从不试图通过预测风向来赚钱，我们赚钱是因为我们买的是能够经受暴风雨的坚固城堡。",
    author: "查理·芒格",
    loading: false
  });

  const reportRef = useRef(null); // Ref for capturing image

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('vm_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('vm_api_key', apiKey);
  }, [apiKey]);

  // Inject html2canvas for image generation
  useEffect(() => {
    if (!document.getElementById('html2canvas-script')) {
      const script = document.createElement('script');
      script.id = 'html2canvas-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // --- AI Helper Functions ---
  
  // 工厂函数：创建指定配置的模型
  const createModel = (key, modelName, useSearch) => {
    const genAI = new GoogleGenerativeAI(key);
    const config = { model: modelName };
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }
    return genAI.getGenerativeModel(config);
  };

  // 辅助函数：尝试多个模型，直到成功
  const runWithModelFallback = async (apiKey, useSearch, callback) => {
    // 动态调整模型列表，优先使用 1.5-flash，因为它最稳定且支持广泛
    const modelsToTry = [
      "gemini-2.5-flash-preview-09-2025", // 尝鲜
      "gemini-2.0-flash-exp",             // 实验版
      "gemini-1.5-flash",                 // 稳定版
      "gemini-1.5-flash-8b",              // 轻量版
      "gemini-1.5-flash-002"              // 特定版本
    ];
    
    // 移除了 gemini-pro，因为它经常报 404
    
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = createModel(apiKey, modelName, useSearch);
        return await callback(model);
      } catch (e) {
        // console.warn(`Model ${modelName} failed:`, e.message); 
        lastError = e;
      }
    }
    
    // 如果开启了搜索但全失败了，尝试最后一次不带搜索的 1.5-flash 作为兜底
    if (useSearch) {
        try {
            console.log("Fallback: attempting no-search mode");
            const model = createModel(apiKey, "gemini-1.5-flash", false);
            return await callback(model, true); // true indicates fallback mode
        } catch (e) {
            console.error("Fallback failed:", e);
        }
    }

    throw lastError;
  };

  // 1. 智能校验股票
  const validateAndFormatStock = async (input) => {
    if (!apiKey) throw new Error("API Key 未配置");
    
    try {
      return await runWithModelFallback(apiKey, false, async (model) => {
        const prompt = `
          你是一个金融助手。用户输入了 "${input}"。
          1. 判断这是否是 A股 (沪深) 或 港股 的股票代码或名称。
          2. 如果是，请返回标准格式："{代码} {标准名称}" (例如 "00700.HK 腾讯控股", "600519.SH 贵州茅台")。
          3. 如果不是有效股票，返回 "INVALID"。
          只返回结果字符串，不要有markdown格式或其他废话。
        `;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      });
    } catch (error) {
      console.error("Validation error:", error);
      throw error;
    }
  };

  // 获取随机大师名言 (支持搜索)
  const fetchRandomQuote = async () => {
    if (!apiKey) return;
    
    setDailyQuote(prev => ({ ...prev, loading: true }));
    try {
      const masters = ["沃伦·巴菲特", "查理·芒格", "段永平 (大道)", "本杰明·格雷厄姆", "彼得·林奇", "塞思·卡拉曼", "霍华德·马克斯"];
      const randomMaster = masters[Math.floor(Math.random() * masters.length)];
      
      const data = await runWithModelFallback(apiKey, true, async (model, isFallback) => {
        const prompt = `
          ${isFallback ? '请回忆' : '请利用 Google Search 搜索'} "${randomMaster}" 关于价值投资、长期主义、安全边际或企业护城河的经典语录。
          返回 JSON 格式：{"text": "名言内容", "author": "${randomMaster}"}
          输出纯 JSON 字符串。
        `;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr);
      });
      
      setDailyQuote({
        text: data.text,
        author: data.author,
        loading: false
      });
    } catch (error) {
      console.error("Quote fetch error:", error);
      setDailyQuote({
        text: "股价短期是投票机，长期是称重机。",
        author: "本杰明·格雷厄姆",
        loading: false
      });
    }
  };

  // 2. 实时搜索并分析
  const fetchAndAnalyzeNews = async (stockName) => {
    try {
      return await runWithModelFallback(apiKey, true, async (model, isFallback) => {
        // 获取当前日期，用于辅助判断 30 天限制
        const today = new Date().toISOString().split('T')[0];
        
        const prompt = `
          ${!isFallback ? `请利用 Google Search 搜索关于 "${stockName}" 的最新动态。` : `请根据你已知的知识库，分析 "${stockName}" 的近期基本面情况（注意：无实时搜索，仅基于历史知识）。`}
          
          **当前日期**：${today}
          
          **关键搜索维度 (风险优先)**：
          1. **风险与利空 (最高权重)**：主动搜索该公司的负面新闻、业绩下滑、大股东减持、法律诉讼、监管处罚。
          2. **公司本体**：最新的公告、财报、分红回购。
          3. **行业与政策**：所属行业动态及宏观政策影响。
          
          **时间范围严格限制**：
          - 仅限 **最近 30 天内** (即 ${today} 往前推30天) 发生的资讯。
          - **严禁**包含超过 1 个月前的旧闻。如果只有旧闻，请返回空数组。

          搜索完成后，请完全模拟 **沃伦·巴菲特** 和 **段永平 (大道)** 的思维模型来审视结果。

          【核心筛选逻辑：大师视角】：
          1. **段永平视角**：公司是否在做"不对的事情"（不本分）？生意模式变好了还是变差了？
          2. **巴菲特视角**：护城河是加宽还是填平了？资本配置是否理智？

          【筛选与生成法则 (严格执行)】：
          1. **时效性熔断**：首先检查每条资讯的时间。**超过30天的直接丢弃**。
          2. **利空占比要求**：请**优先保留**所有真实的负面/风险类资讯。如果存在此类风险，请尽量使其在结果中的占比达到 **30% 以上**。
          3. **极度严苛的降噪**：坚决剔除股价短期波动、技术面分析等噪音。
          4. **弹性数量**：如果有重大事件，最多返回 3 条。如果没有，1条或0条均可。
          
          请将结果整理为 JSON 格式数组。每个对象包含：
          - type: "公司" | "行业" | "政策"
          - summary: 详实的资讯摘要。
          - sentiment: "bullish" | "bearish" | "neutral"
          - reason: 一句话解释其价值逻辑（**直接阐述对护城河、商业模式的影响，不要提及具体名人姓名**）。
          - source: ${!isFallback ? '新闻来源名称' : 'AI 知识库'}
          - url: ${!isFallback ? '原始链接' : 'null'}
          - time: 发布时间。
          - is_fresh: true/false.

          输出纯 JSON 字符串，无 Markdown 标记。
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr);
      });
    } catch (e) {
      console.error(`Search error for ${stockName}:`, e);
      return []; 
    }
  };

  // --- Handlers ---

  const handleAddStock = async () => {
    if (!stockInput.trim()) return;
    if (stocks.length >= 10) {
      alert("坚守能力圈：为了保持关注度，最多只能添加10只股票。");
      return;
    }
    
    setValidating(true);
    setStatusMsg("正在校验股票代码...");
    
    try {
      let formattedName = stockInput;
      if (apiKey) {
        const result = await validateAndFormatStock(stockInput);
        if (result.includes("INVALID")) {
          alert("无法识别该股票，请输入正确的A股/港股代码或名称。");
          setValidating(false);
          setStatusMsg("");
          return;
        }
        formattedName = result;
      } else {
        formattedName = stockInput.toUpperCase(); 
        alert("提示：配置 API Key 后可开启智能股票校验功能。");
      }

      if (stocks.some(s => s.name === formattedName)) {
        setStockInput('');
        setValidating(false);
        setStatusMsg("");
        return;
      }

      const newStock = {
        name: formattedName,
        date: new Date().toLocaleDateString()
      };

      setStocks([...stocks, newStock]);
      setStockInput('');
    } catch (e) {
      console.error("Add stock error:", e);
      let errorMsg = `校验失败: ${e.message || "未知错误"}`;
      if (e.message && e.message.includes("fetch")) errorMsg = "连接失败：Google API 无法访问 (请开启 VPN)";
      
      const confirmForce = window.confirm(`${errorMsg}\n\n是否跳过校验，强制添加 "${stockInput}"？`);
      
      if (confirmForce) {
        const newStock = {
          name: stockInput.toUpperCase(), 
          date: new Date().toLocaleDateString()
        };
        if (!stocks.some(s => s.name === newStock.name)) {
           setStocks([...stocks, newStock]);
           setStockInput('');
        }
      }
    } finally {
      setValidating(false);
      setStatusMsg("");
    }
  };

  const handleRemoveStock = (indexToRemove) => {
    setStocks(stocks.filter((_, index) => index !== indexToRemove));
  };

  const generateReport = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    if (stocks.length === 0) return;

    setLoading(true);
    setReport([]);
    setStatusMsg("正在按持仓顺序扫描全网动态...");
    
    fetchRandomQuote();

    try {
      const promises = stocks.map(async (stockObj) => {
        try {
          const filteredItems = await fetchAndAnalyzeNews(stockObj.name);
          if (!filteredItems || filteredItems.length === 0) return [];
          return filteredItems.map(item => ({
            id: Date.now() + Math.random(),
            stock: stockObj.name,
            ...item
          }));
        } catch (e) {
          console.error(`Failed to fetch for ${stockObj.name}:`, e);
          return [{
            id: Date.now(),
            stock: stockObj.name,
            type: "系统",
            summary: `获取数据失败: ${e.message}`,
            sentiment: "neutral",
            reason: "API调用或网络错误",
            time: "现在",
            source: "System",
            url: null
          }];
        }
      });

      const results = await Promise.all(promises);
      let allReports = results.flat();

      if (allReports.length === 0) {
        setStatusMsg("近期（30天内）市场与政策面较为平静。");
      } else {
        setStatusMsg(`扫描完成，共生成 ${allReports.length} 条深度资讯。`);
      }
      
      setReport(allReports);

    } catch (error) {
      console.error(error);
      alert(`生成报告失败: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 5000);
    }
  };

  const handleDownloadImage = async () => {
    if (!window.html2canvas) {
      alert("组件资源正在加载中，请稍后再试...");
      return;
    }

    const element = reportRef.current;
    if (!element) return;
    
    const originalStatus = statusMsg;
    setStatusMsg("正在渲染长图，请稍候...");

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await window.html2canvas(element, {
        backgroundColor: '#0a0a0a', 
        scale: 2, 
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('report-capture-area');
          if (clonedElement) {
             clonedElement.style.padding = '30px'; 
             clonedElement.style.height = 'auto';
             clonedElement.style.width = '100%';
             const allTexts = clonedElement.querySelectorAll('*');
             allTexts.forEach(el => el.style.overflow = 'visible');
          }
        }
      });
      
      const link = document.createElement('a');
      const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
      link.download = `ValueMoat_Report_${dateStr}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setStatusMsg("长图已保存到相册/下载文件夹");
    } catch (err) {
      console.error(err);
      alert("生成图片失败，请重试");
    } finally {
      setTimeout(() => setStatusMsg(originalStatus), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans selection:bg-yellow-500/30 pb-20 relative">
      
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-yellow-600/30 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-yellow-500 font-bold flex items-center gap-2">
                <Settings size={18} /> 设置 API Key
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-neutral-400 text-xs mb-4">
              为了启用<span className="text-yellow-500 font-bold">实时搜索数据</span>功能，请输入您的 Gemini API Key。您的 Key 仅保存在本地浏览器中。
            </p>
            <div className="relative mb-4">
               <Key className="absolute left-3 top-2.5 text-neutral-600" size={16} />
               <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API Key here..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded pl-10 pr-4 py-2 text-sm focus:border-yellow-600 outline-none text-white"
               />
            </div>
            <div className="flex gap-2 items-start text-red-400/80 text-[10px] mb-4 bg-red-950/20 p-2 rounded border border-red-900/30">
               <AlertTriangle size={14} className="shrink-0 mt-0.5" />
               <p>注意：如果您在中国大陆，必须开启系统全局 VPN/代理 才能连接 Google API。否则会显示“连接失败”。</p>
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full bg-yellow-700 hover:bg-yellow-600 text-black font-bold py-2 rounded transition-colors"
            >
              保存并关闭
            </button>
          </div>
        </div>
      )}

      <header className="bg-neutral-900 border-b border-yellow-600/20 pt-10 pb-6 px-6 sticky top-0 z-50 shadow-xl shadow-black/50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 tracking-wider">
                VALUE MOAT <span className="text-xs align-top text-yellow-800 ml-1">Live</span>
              </h1>
              <p className="text-neutral-500 text-xs mt-1 tracking-widest uppercase">
                实时搜索 · 政策透视 · 价值筛选
              </p>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-neutral-500 hover:text-yellow-500 transition-colors"
            >
               <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-8">
        
        <QuoteSection dailyQuote={dailyQuote} onRefresh={fetchRandomQuote} />

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
              <Briefcase size={16} className="text-yellow-600" />
              核心持仓 ({stocks.length}/10)
            </h2>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="输入代码或名称 (如: 腾讯)"
              disabled={validating}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-600/50 transition-colors placeholder:text-neutral-700 disabled:opacity-50"
            />
            <button
              onClick={handleAddStock}
              disabled={validating}
              className="bg-neutral-800 hover:bg-neutral-700 text-yellow-500 rounded px-4 py-2 flex items-center justify-center transition-colors border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px]"
            >
              {validating ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={20} />}
            </button>
          </div>

          {stocks.length > 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden mb-6 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-800/80 text-yellow-600 font-bold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-mono">标的</th>
                    <th className="px-4 py-3 font-mono">加入时间</th>
                    <th className="px-4 py-3 font-mono text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-sm">
                  {stocks.map((stock, idx) => {
                    const parts = stock.name.split(' ');
                    const displayName = parts.length > 1 ? parts[1] : parts[0];
                    const code = parts.length > 1 ? parts[0] : '';

                    return (
                      <tr key={idx} className="hover:bg-neutral-800/30 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-gray-200 font-medium">{displayName}</span>
                            {code && <span className="text-neutral-500 text-[10px] font-mono">{code}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-400 text-xs font-mono flex items-center gap-1">
                          <Calendar size={10} className="text-neutral-600" />
                          {stock.date}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleRemoveStock(idx)}
                            className="text-neutral-600 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-neutral-800"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-6 bg-neutral-900/30 rounded border border-dashed border-neutral-800 mb-6">
                <p className="text-neutral-500 text-xs italic">
                  {apiKey ? "请输入股票名称，AI 将自动校验并记录时间..." : "请先配置 API Key 以开启智能功能"}
                </p>
             </div>
          )}
        </section>

        <section>
          <button
            onClick={generateReport}
            disabled={loading || stocks.length === 0}
            className={`w-full py-3.5 rounded font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 shadow-lg relative overflow-hidden ${
              loading 
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-800'
                : 'bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-neutral-950 shadow-yellow-900/20'
            }`}
          >
            {loading ? (
              <>
                <Globe size={16} className="animate-pulse" />
                正在深度扫描 (顺序优先)...
              </>
            ) : (
              <>
                <FileText size={16} />
                每日({new Date().toLocaleDateString()})价值简报
              </>
            )}
          </button>
          
          <div className="h-6 mt-2 text-center">
             {statusMsg && (
               <p className="text-yellow-600/80 text-[10px] animate-pulse font-mono">
                 &gt; {statusMsg}
               </p>
             )}
          </div>
        </section>

        {report.length > 0 && (
          <section className="animate-fade-in pb-10">
            <div id="report-capture-area" ref={reportRef} className="bg-neutral-950 p-2 rounded-lg">
                <QuoteSection dailyQuote={dailyQuote} onRefresh={fetchRandomQuote} />
                
                <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-2 px-2">
                    <h3 className="text-yellow-500 font-bold text-lg flex items-center gap-2">
                        <Briefcase size={20} />
                        持仓动态
                    </h3>
                    <span className="text-neutral-600 text-xs font-mono">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="space-y-1">
                {report.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
                </div>
                
                <div className="mt-8 p-4 bg-neutral-900/40 rounded-xl border border-neutral-800/50 text-center">
                    <p className="text-neutral-600 text-[10px] tracking-widest uppercase">
                        Value Moat · Intelligent Investment Assistant
                    </p>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-500 px-6 py-2.5 rounded-full text-sm font-bold border border-yellow-600/30 transition-all shadow-lg hover:shadow-yellow-900/20"
                >
                    <Download size={16} />
                    保存为长图
                </button>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ValueMoat;