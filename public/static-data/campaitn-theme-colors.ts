const campaignThemeColors = [
  {
    text: "#1d4ed8", // text-blue-700
    darker: "#1e40af", // bg-blue-700
    dark: "#3b82f6", // bg-blue-500
    xlight: "#eff6ff", // bg-blue-50
    light: "#dbeafe", // bg-blue-100
    gradient: "#3b82f6", // bg-g-blue (can replace with your custom gradient color)
    border: "#1e40af", // border-blue-700
    fill: "#1e40af", // fill-blue-700
  },
  {
    text: "#0e7490", // text-cyan-700
    darker: "#0e4c75", // bg-cyan-700
    dark: "#06b6d4", // bg-cyan-500
    xlight: "#ecfeff", // bg-cyan-50
    light: "#cffafe", // bg-cyan-100
    gradient: "#06b6d4", // bg-g-cyan (can replace with your custom gradient color)
    border: "#0e4c75", // border-cyan-700
    fill: "#0e4c75", // fill-cyan-700
  },
  {
    text: "#0f4f6e", // text-teal-700
    darker: "#134e5e", // bg-teal-700
    dark: "#14b8a6", // bg-teal-500
    xlight: "#f0fdfa", // bg-teal-50
    light: "#ccfbf1", // bg-teal-100
    gradient: "#14b8a6", // bg-g-teal (can replace with your custom gradient color)
    border: "#134e5e", // border-teal-700
    fill: "#134e5e", // fill-teal-700
  },
  {
    text: "#065f46", // text-green-700
    darker: "#065f46", // bg-green-700
    dark: "#16a34a", // bg-green-600
    xlight: "#f0fdf4", // bg-green-50
    light: "#d1fae5", // bg-green-100
    gradient: "#16a34a", // bg-g-green (can replace with your custom gradient color)
    border: "#065f46", // border-green-700
    fill: "#065f46", // fill-green-700
  },
  {
    text: "#4d7c1f", // text-lime-700
    text2: "#84cc16", // text-lime-500
    darker: "#4d7c1f", // bg-lime-700
    dark: "#65a30d", // bg-lime-400
    xlight: "#f7fee7", // bg-lime-50
    light: "#d9f99d", // bg-lime-100
    gradient: "#65a30d", // bg-g-lime (can replace with your custom gradient color)
    border: "#4d7c1f", // border-lime-700
    border2: "#65a30d", // border-lime-400
    borderLight: "#65a30d", // border-lime-400
    fill: "#4d7c1f", // fill-lime-700
  },
  {
    text: "#b45309", // text-yellow-700
    darker: "#b45309", // bg-yellow-700
    dark: "#f59e0b", // bg-yellow-400
    xlight: "#fef3c7", // bg-yellow-50
    light: "#fef9c3", // bg-yellow-100
    gradient: "#f59e0b", // bg-g-yellow (can replace with your custom gradient color)
    border: "#b45309", // border-yellow-700
    fill: "#b45309", // fill-yellow-700
  },
  {
    text: "#9c4221", // text-orange-700
    darker: "#9c4221", // bg-orange-700
    dark: "#ea580c", // bg-orange-500
    xlight: "#fff7ed", // bg-orange-50
    light: "#ffedd5", // bg-orange-100
    gradient: "#ea580c", // bg-g-orange (can replace with your custom gradient color)
    border: "#9c4221", // border-orange-700
    fill: "#9c4221", // fill-orange-700
  },
  {
    text: "#9b2c2c", // text-red-700
    darker: "#9b2c2c", // bg-red-700
    dark: "#dc2626", // bg-red-600
    xlight: "#fee2e2", // bg-red-50
    light: "#fecaca", // bg-red-100
    gradient: "#dc2626", // bg-g-red (can replace with your custom gradient color)
    border: "#9b2c2c", // border-red-700
    fill: "#9b2c2c", // fill-red-700
  },
  {
    text: "#d946ef", // text-pink-600
    darker: "#9d174d", // bg-pink-700
    dark: "#d946ef", // bg-pink-600
    light: "#fbcfe8", // bg-pink-100
    xlight: "#fce7f3", // bg-pink-50
    gradient: "#d946ef", // bg-g-pink (can replace with your custom gradient color)
    border: "#9d174d", // border-pink-700
    fill: "#9d174d", // fill-pink-700
  },
  {
    text: "#6b21a8", // text-purple-700
    darker: "#6b21a8", // bg-purple-700
    dark: "#7c3aed", // bg-purple-600
    xlight: "#f3e8ff", // bg-purple-50
    light: "#e9d5ff", // bg-purple-100
    gradient: "#7c3aed", // bg-g-purple (can replace with your custom gradient color)
    border: "#6b21a8", // border-purple-700
    fill: "#6b21a8", // fill-purple-700
  },
  {
    text: "#4338ca", // text-indigo-700
    darker: "#4338ca", // bg-indigo-700
    dark: "#4f46e5", // bg-indigo-600
    xlight: "#eef2ff", // bg-indigo-50
    light: "#c7d2fe", // bg-indigo-100
    gradient: "#4f46e5", // bg-g-indigo (can replace with your custom gradient color)
    border: "#4338ca", // border-indigo-700
    fill: "#4338ca", // fill-indigo-700
  },
  {
    text: "#475569", // text-slate-700
    darker: "#475569", // bg-slate-700
    dark: "#64748b", // bg-slate-400
    xlight: "#f1f5f9", // bg-slate-50
    light: "#e2e8f0", // bg-slate-100
    gradient: "#64748b", // bg-g-slate (can replace with your custom gradient color)
    border: "#475569", // border-slate-700
    fill: "#475569", // fill-slate-700
  },
  {
    text: "#374151", // text-gray-700
    darker: "#374151", // bg-gray-700
    dark: "#4b5563", // bg-gray-600
    xlight: "#f9fafb", // bg-gray-50
    light: "#f3f4f6", // bg-gray-100
    gradient: "#4b5563", // bg-g-gray (can replace with your custom gradient color)
    border: "#374151", // border-gray-700
    fill: "#374151", // fill-gray-700
  },
  {
    text: "#333333", // text-zinc-700
    darker: "#1c1917", // bg-zinc-900
    dark: "#3f3f46", // bg-zinc-800
    light: "#f4f4f5", // bg-zinc-100
    xlight: "#fafafa", // bg-zinc-50
    gradient: "#3f3f46", // bg-g-zinc (can replace with your custom gradient color)
    border: "#333333", // border-zinc-700
    fill: "#333333", // fill-zinc-700
  },
];

export default campaignThemeColors;
