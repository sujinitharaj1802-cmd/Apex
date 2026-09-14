import os

replacements = [
    ("bg-[#0F172A]", "bg-surface"),
    ("bg-[#0B1120]", "bg-bg"),
    ("bg-[#080D1A]", "bg-bg"),
    ("bg-[#0A0F1D]", "bg-bg"),
    ("border-slate-800", "border-border"),
    ("border-slate-700", "border-border"),
    ("text-slate-400", "text-text-muted"),
    ("text-slate-300", "text-text-muted"),
    ("text-slate-200", "text-text"),
    ("text-slate-100", "text-text"),
    ("text-white", "text-text"),
    ("hover:border-slate-700", "hover:border-border"),
    ("hover:bg-slate-850", "hover:bg-surface"),
    ("hover:text-white", "hover:text-text"),
    ("bg-slate-900", "bg-surface"),
    ("bg-slate-950", "bg-bg"),
    ("text-[#8B96AA]", "text-text-muted"),
    ("text-[#94A3B8]", "text-text-muted"),
    ("text-[#CBD5E1]", "text-text-muted"),
    ("text-[#E7EAF0]", "text-text"),
    ("text-[#FFFFFF]", "text-text"),
    ("text-[#F8FAFC]", "text-text"),
    ("text-[#C9A227]", "text-accent"),
    ("text-[#C4554D]", "text-alert"),
    ("bg-[#C9A227]", "bg-accent"),
    ("bg-[#C4554D]", "bg-alert"),
    ("border-[#C9A227]", "border-accent"),
    ("border-[#C4554D]", "border-alert"),
    ("#C9A227", "var(--color-accent)"),
    ("#C4554D", "var(--color-alert)"),
    ("#E7EAF0", "var(--color-text)"),
    ("#FFFFFF", "var(--color-text)"),
    ("#F8FAFC", "var(--color-text)"),
    ("#8B96AA", "var(--color-text-muted)"),
    ("#94A3B8", "var(--color-text-muted)"),
    ("#CBD5E1", "var(--color-text-muted)"),
    ("#0F1B2D", "var(--color-bg)"),
    ("#080D1A", "var(--color-bg)"),
    ("#0A0F1D", "var(--color-bg)"),
    ("#17253D", "var(--color-surface)"),
    ("#0F172A", "var(--color-surface)"),
    ("#0B1120", "var(--color-surface)"),
    ("#2A3B57", "var(--color-border)"),
    ("#1E293B", "var(--color-border)"),
    ("#334155", "var(--color-border)"),
]

files = [
    r"C:\Users\Suji\.gemini\antigravity\scratch\drishthinet-prototype\src\pages\GisTopologyPage.tsx",
    r"C:\Users\Suji\.gemini\antigravity\scratch\drishthinet-prototype\src\pages\HealthDashboardPage.tsx",
    r"C:\Users\Suji\.gemini\antigravity\scratch\drishthinet-prototype\src\pages\IntegrationBoardPage.tsx"
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Processed {filepath}")
