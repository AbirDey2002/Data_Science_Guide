'use client';

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// note structure: { desc, math, code }
const treeData = {
  name: "Pre-Modelling Framework",
  type: "root",
  note: {
    desc: "Pre-modelling is the systematic process of interrogating your data before training any model. It answers: Is my data healthy? Do my variables carry signal? Am I violating model assumptions? Skipping this leads to overfitting, biased coefficients, multicollinearity, and wasted compute.",
    math: "No single formula — pre-modelling is a framework of sequential statistical decisions that together validate data fitness for modelling.",
    code: `# Pre-modelling starter setup
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

df = pd.read_csv("your_data.csv")
print(df.shape)
print(df.dtypes)
print(df.describe())
print(df.isnull().sum())`
  },
  children: [
    {
      name: "Checkpoint 1", subtitle: "Variable Relevance", type: "checkpoint",
      note: {
        desc: "Does each variable deserve a seat at the table? Your approach depends on the type pairing between the variable and the target. Three pairings: continuous vs continuous, categorical vs continuous, categorical vs categorical. Each has its own statistical toolkit.",
        math: "The core question: is the association between predictor X and target Y statistically significant AND practically meaningful? Significance without magnitude is noise at scale.",
        code: `# Identify variable types
num_cols = df.select_dtypes(include=np.number).columns.tolist()
cat_cols = df.select_dtypes(include='object').columns.tolist()
target = 'your_target_column'

print("Numeric:", num_cols)
print("Categorical:", cat_cols)`
      },
      children: [
        {
          name: "Continuous vs Continuous", type: "category",
          note: {
            desc: "When both predictor and target are continuous, you measure how strongly and consistently they move together. Always pair a scatter plot with a statistical test — never rely on one alone.",
            math: "Visual: scatter plot. Statistical: correlation coefficient. Both direction (sign) and magnitude (absolute value) matter for the modelling decision.",
            code: `# Quick visual overview of all continuous correlations
corr_matrix = df[num_cols].corr()
plt.figure(figsize=(12, 8))
sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', center=0)
plt.title("Correlation Matrix")
plt.show()`
          },
          children: [
            {
              name: "Pearson Correlation", type: "test",
              note: {
                desc: "Measures the strength and direction of a LINEAR relationship between two continuous variables. Assumes both variables are normally distributed. Sensitive to outliers — a single extreme point can distort r significantly. Always inspect a scatter plot alongside the coefficient.",
                math: `r = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / √[Σ(xᵢ - x̄)² × Σ(yᵢ - ȳ)²]

Range: -1 to +1
|r| < 0.1  → negligible
0.1–0.3    → weak
0.3–0.5    → moderate
> 0.5      → strong

Test statistic: t = r√(n-2) / √(1-r²)
Degrees of freedom: n - 2`,
                code: `from scipy.stats import pearsonr

for col in num_cols:
    if col != target:
        r, p = pearsonr(df[col].dropna(), df[target].dropna())
        print(f"{col}: r={r:.3f}, p={p:.4f}")`
              }
            },
            {
              name: "Spearman Correlation", type: "test",
              note: {
                desc: "Non-parametric alternative to Pearson. Works on RANKS rather than raw values — robust to outliers and non-normal distributions. Use when data is skewed, contains outliers, or the relationship is monotonic but not strictly linear. If Spearman >> Pearson, the relationship is curved.",
                math: `ρ = 1 - (6 × Σdᵢ²) / (n(n²-1))

where dᵢ = rank(xᵢ) - rank(yᵢ)

Equivalent to Pearson on ranked data.

Signal: if |ρ - r_pearson| > 0.1,
relationship is likely non-linear → flag for Checkpoint 2 linearity check`,
                code: `from scipy.stats import spearmanr, pearsonr

for col in num_cols:
    if col != target:
        rho, p_s = spearmanr(df[col].dropna(), df[target].dropna())
        r, p_p = pearsonr(df[col].dropna(), df[target].dropna())
        diff = abs(rho) - abs(r)
        flag = "⚠ CURVED" if diff > 0.1 else ""
        print(f"{col}: Spearman={rho:.3f}, Pearson={r:.3f}, diff={diff:.3f} {flag}")`
              }
            },
            {
              name: "VIF", type: "test",
              note: {
                desc: "Variance Inflation Factor checks for multicollinearity among INPUT variables — not with the target. Catches GROUP collinearity that pairwise correlation matrices miss entirely. Three or four variables can be collectively collinear even when no single pair exceeds 0.8.",
                math: `VIF_j = 1 / (1 - R²_j)

where R²_j = R-squared from regressing
variable j on ALL other predictors.

VIF = 1       → no collinearity
VIF 1–5       → acceptable
VIF 5–10      → investigate
VIF > 10      → serious, action required

Interpretation: VIF of 5 means the variance
of coefficient j is 5× larger than it would
be with no collinearity.`,
                code: `from statsmodels.stats.outliers_influence import variance_inflation_factor

X = df[num_cols].dropna()
vif_data = pd.DataFrame()
vif_data["feature"] = X.columns
vif_data["VIF"] = [
    variance_inflation_factor(X.values, i)
    for i in range(X.shape[1])
]
print(vif_data.sort_values("VIF", ascending=False))`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "KEEP if significant AND moderate-to-strong magnitude. DROP if neither significant nor meaningful. For multicollinearity: keep whichever collinear variable has stronger correlation with target. Options: drop the weaker one, create a composite feature, or use Ridge Regression.",
                math: `Decision rule for VIF:
VIF > 10 → must act
Options ranked by invasiveness:
1. Drop weaker variable (most invasive)
2. PCA on the collinear group
3. Ridge regression (λ shrinks correlated
   coefficients — least invasive)`,
                code: `# Drop high-VIF features iteratively
def remove_high_vif(df, thresh=10):
    cols = list(df.columns)
    while True:
        X = df[cols].dropna()
        vifs = [variance_inflation_factor(X.values, i)
                for i in range(X.shape[1])]
        max_vif = max(vifs)
        if max_vif > thresh:
            drop = cols[vifs.index(max_vif)]
            print(f"Dropping {drop} (VIF={max_vif:.1f})")
            cols.remove(drop)
        else:
            break
    return cols

kept = remove_high_vif(df[num_cols])`
              }
            },
          ]
        },
        {
          name: "Categorical vs Continuous", type: "category",
          note: {
            desc: "Does the value of a categorical variable shift the distribution of a continuous target? If all groups produce similar distributions, the categorical variable adds no predictive signal. Test choice depends on: number of groups and whether normality holds within groups.",
            math: "Core question: is the between-group variance significantly larger than within-group variance? The F-statistic in ANOVA captures this ratio directly.",
            code: `# Check group distributions visually first
for col in cat_cols:
    plt.figure(figsize=(10, 4))
    df.boxplot(column=target, by=col)
    plt.title(f"{target} by {col}")
    plt.suptitle("")
    plt.show()`
          },
          children: [
            {
              name: "t-test / ANOVA", type: "test",
              note: {
                desc: "t-test for 2 groups, ANOVA for 3+. Both test whether group MEANS differ significantly. ANOVA asks: is variance BETWEEN groups larger than variance WITHIN groups? Requires approximate normality within groups and roughly equal variances (homoscedasticity).",
                math: `t-test (2 groups):
t = (x̄₁ - x̄₂) / √(s²_p × (1/n₁ + 1/n₂))
where s²_p = pooled variance
df = n₁ + n₂ - 2

ANOVA (3+ groups):
F = MS_between / MS_within
  = [Σnⱼ(ȳⱼ - ȳ)²/(k-1)] / [ΣΣ(yᵢⱼ - ȳⱼ)²/(N-k)]

k = number of groups, N = total observations
Significant F → at least one group mean differs`,
                code: `from scipy.stats import f_oneway, ttest_ind

for col in cat_cols:
    groups = [df[df[col]==g][target].dropna()
              for g in df[col].unique()]
    if len(groups) == 2:
        stat, p = ttest_ind(*groups)
        test = "t-test"
    else:
        stat, p = f_oneway(*groups)
        test = "ANOVA"
    print(f"{col} [{test}]: stat={stat:.3f}, p={p:.4f}")`
              }
            },
            {
              name: "Mann-Whitney / Kruskal-Wallis", type: "test",
              note: {
                desc: "Non-parametric alternatives when normality fails. Work on RANKS rather than raw values — robust to skewed distributions and outliers. Test whether DISTRIBUTIONS differ (more general than means). Sacrifice some power compared to parametric tests when normality holds.",
                math: `Mann-Whitney U (2 groups):
U = n₁n₂ + n₁(n₁+1)/2 - R₁
where R₁ = sum of ranks for group 1

Kruskal-Wallis H (3+ groups):
H = [12/N(N+1)] × Σ[nⱼR̄ⱼ²] - 3(N+1)
where R̄ⱼ = mean rank in group j
H ~ χ² with k-1 degrees of freedom`,
                code: `from scipy.stats import mannwhitneyu, kruskal

for col in cat_cols:
    groups = [df[df[col]==g][target].dropna()
              for g in df[col].unique()]
    if len(groups) == 2:
        stat, p = mannwhitneyu(*groups, alternative='two-sided')
        test = "Mann-Whitney"
    else:
        stat, p = kruskal(*groups)
        test = "Kruskal-Wallis"
    print(f"{col} [{test}]: stat={stat:.3f}, p={p:.4f}")`
              }
            },
            {
              name: "Tukey HSD (post-hoc)", type: "test",
              note: {
                desc: "ANOVA tells you THAT a difference exists — not WHERE. Tukey HSD performs all pairwise comparisons while controlling the family-wise error rate. Reveals which specific groups differ — critical for deciding whether to collapse similar groups into one category.",
                math: `Tukey HSD critical value:
q* = (ȳᵢ - ȳⱼ) / √(MS_within/2 × (1/nᵢ + 1/nⱼ))

compared against Studentised Range distribution.
Groups i and j differ significantly if |q*| > q_α

Family-wise error rate controlled at α
regardless of number of comparisons made.`,
                code: `from statsmodels.stats.multicomp import pairwise_tukeyhsd

for col in cat_cols:
    result = pairwise_tukeyhsd(
        endog=df[target].dropna(),
        groups=df[col][df[target].notna()],
        alpha=0.05
    )
    print(f"\n{col}:")
    print(result.summary())`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "KEEP if test is significant. COLLAPSE GROUPS if post-hoc shows most groups are similar — merge indistinguishable ones. CHECK group sizes — very small groups (n < 30) make significance unreliable. DROP if no significant difference and no theoretical reason to keep.",
                math: `Effect size for group differences:
Cohen's d (2 groups):
d = (x̄₁ - x̄₂) / s_pooled

Eta-squared η² (ANOVA):
η² = SS_between / SS_total
0.01 = small, 0.06 = medium, 0.14 = large

Always report effect size alongside p-value.`,
                code: `# Effect size: eta-squared after ANOVA
def eta_squared(groups):
    all_data = np.concatenate(groups)
    grand_mean = np.mean(all_data)
    ss_between = sum(len(g)*(np.mean(g)-grand_mean)**2
                     for g in groups)
    ss_total = sum((x-grand_mean)**2 for x in all_data)
    return ss_between / ss_total

for col in cat_cols:
    groups = [df[df[col]==g][target].dropna().values
              for g in df[col].unique()]
    eta2 = eta_squared(groups)
    print(f"{col}: η²={eta2:.3f}")`
              }
            },
          ]
        },
        {
          name: "Categorical vs Categorical", type: "category",
          note: {
            desc: "Does knowing the category of one variable change the probability distribution of the other? Core tool is the contingency table. Always pair Chi-Square (significance) with Cramér's V (effect size) — Chi-Square alone is meaningless at large sample sizes.",
            math: "Chi-Square tests observed vs expected frequencies under independence. Cramér's V normalises the test statistic to a 0–1 scale for effect size.",
            code: `# Contingency table for any two categorical columns
col1, col2 = 'feature_col', target
ct = pd.crosstab(df[col1], df[col2])
print(ct)
# Visualise
ct.plot(kind='bar', stacked=True)
plt.show()`
          },
          children: [
            {
              name: "Chi-Square Test", type: "test",
              note: {
                desc: "Tests whether observed frequencies differ from expected under independence. Significant result = association exists, but says NOTHING about strength. With 100k+ rows almost everything becomes significant. Expected cell frequency must be ≥ 5 in all cells — violation makes the test unreliable.",
                math: `χ² = Σ [(Oᵢⱼ - Eᵢⱼ)² / Eᵢⱼ]

where:
Oᵢⱼ = observed count in cell (i,j)
Eᵢⱼ = expected count = (row_total × col_total) / N

df = (rows - 1) × (cols - 1)

Expected cell counts: Eᵢⱼ = (Rᵢ × Cⱼ) / N
All Eᵢⱼ must be ≥ 5 for valid test`,
                code: `from scipy.stats import chi2_contingency

for col in cat_cols:
    if col != target:
        ct = pd.crosstab(df[col], df[target])
        chi2, p, dof, expected = chi2_contingency(ct)
        min_exp = expected.min()
        print(f"{col}: χ²={chi2:.2f}, p={p:.4f}, "
              f"df={dof}, min_expected={min_exp:.1f}")`
              }
            },
            {
              name: "Cramér's V", type: "test",
              note: {
                desc: "Effect size companion to Chi-Square. Ranges 0 to 1. Essential for practical significance — Chi-Square will be significant at large n even for negligible associations. Cramér's V tells you whether the association is actually worth including in a model.",
                math: `V = √(χ² / (N × min(r-1, c-1)))

where:
N = total observations
r = number of rows
c = number of columns

Interpretation:
0.0–0.1 → negligible
0.1–0.3 → weak
0.3–0.5 → moderate
> 0.5   → strong`,
                code: `def cramers_v(x, y):
    ct = pd.crosstab(x, y)
    chi2, _, _, _ = chi2_contingency(ct)
    n = ct.sum().sum()
    r, c = ct.shape
    return np.sqrt(chi2 / (n * (min(r, c) - 1)))

for col in cat_cols:
    if col != target:
        v = cramers_v(df[col], df[target])
        print(f"{col}: Cramér's V = {v:.3f}")`
              }
            },
            {
              name: "Fisher's Exact Test", type: "test",
              note: {
                desc: "Use when any expected cell count falls below 5 — Chi-Square becomes unreliable. Fisher's calculates the exact probability of observing a table as extreme as yours under independence. Computationally intensive for large tables; best suited for 2×2.",
                math: `P = (R₁! × R₂! × C₁! × C₂!) / (N! × a! × b! × c! × d!)

For a 2×2 table:
| a  b | → R₁ = a+b
| c  d | → R₂ = c+d
            C₁=a+c, C₂=b+d, N=a+b+c+d

P-value = sum of probabilities of all tables
as extreme or more extreme than observed.`,
                code: `from scipy.stats import fisher_exact

# For 2x2 tables with small expected counts
for col in cat_cols:
    if col != target:
        ct = pd.crosstab(df[col], df[target])
        if ct.shape == (2, 2):
            _, expected = chi2_contingency(ct)[:2], chi2_contingency(ct)[3]
            if expected.min() < 5:
                odds, p = fisher_exact(ct)
                print(f"{col}: Fisher p={p:.4f}, OR={odds:.3f}")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "KEEP if Chi-Square significant AND Cramér's V > 0.1 minimum. DROP if not significant. WATCH FOR quasi-separation: one category almost perfectly predicts a target class — this is categorical multicollinearity and will destabilise model coefficients. Merge sparse categories (< 30 obs) with similar ones.",
                math: `Quasi-separation check:
P(Y=1 | X=cat_k) ≈ 1 or ≈ 0
→ perfect or near-perfect separation

In logistic regression this causes:
coefficient → ±∞, standard error → ∞
Model converges poorly or not at all.`,
                code: `# Check for quasi-separation in binary classification
for col in cat_cols:
    if col != target:
        rates = df.groupby(col)[target].mean()
        extreme = rates[(rates > 0.95) | (rates < 0.05)]
        if len(extreme) > 0:
            print(f"⚠ Quasi-separation risk in {col}:")
            print(extreme)`
              }
            },
          ]
        },
      ]
    },
    {
      name: "Checkpoint 2", subtitle: "Distribution & Assumptions", type: "checkpoint",
      note: {
        desc: "Every model carries hidden assumptions. Violate them and the model quietly gives wrong answers with full confidence. Understand your data's behaviour first, then choose a model that suits it — or transform the data. The four core assumptions: normality, homoscedasticity, independence, and linearity.",
        math: "Each assumption can be expressed as a null hypothesis to be tested. Violations don't cause model crashes — they cause systematically biased inference that looks valid on the surface.",
        code: `# Distribution overview for all numeric columns
fig, axes = plt.subplots(len(num_cols), 2, figsize=(12, 4*len(num_cols)))
for i, col in enumerate(num_cols):
    df[col].hist(ax=axes[i,0], bins=30)
    axes[i,0].set_title(f'{col} - Histogram')
    stats.probplot(df[col].dropna(), plot=axes[i,1])
    axes[i,1].set_title(f'{col} - Q-Q Plot')
plt.tight_layout()
plt.show()`
      },
      children: [
        {
          name: "Normality Testing", type: "category",
          note: {
            desc: "Checks whether a variable follows a Gaussian distribution. CRITICAL NUANCE: linear regression requires RESIDUAL normality, not input normality. Testing inputs here is early warning — severely skewed inputs usually produce non-normal residuals. Always use visual + statistical together.",
            math: "The normal distribution: f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²). Skewness = 0 and kurtosis = 3 for a perfect normal distribution. We test deviations from these properties.",
            code: `from scipy.stats import skew, kurtosis

for col in num_cols:
    s = skew(df[col].dropna())
    k = kurtosis(df[col].dropna())  # excess kurtosis
    print(f"{col}: skewness={s:.3f}, kurtosis={k:.3f}")`
          },
          children: [
            {
              name: "Q-Q Plot + Histogram", type: "test",
              note: {
                desc: "Q-Q plot is your most powerful visual check. Plots quantiles of your data against theoretical normal quantiles. READING DEVIATIONS: S-curve = skewness. Both tails above line = heavy tails (leptokurtic). Both tails below = light tails. Histogram should show bell shape, symmetry, no multiple peaks.",
                math: `Q-Q plot construction:
1. Sort data: x₍₁₎ ≤ x₍₂₎ ≤ ... ≤ x₍ₙ₎
2. Compute theoretical quantiles:
   zᵢ = Φ⁻¹((i - 0.375) / (n + 0.25))
   where Φ⁻¹ = inverse normal CDF
3. Plot (zᵢ, x₍ᵢ₎) — should follow y=x line

Tail deviation patterns:
Points above line at both ends → heavy tails
S-shaped curve → skewness present`,
                code: `import scipy.stats as stats
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Histogram with normal overlay
col = target  # or any numeric column
data = df[col].dropna()
axes[0].hist(data, bins=30, density=True, alpha=0.6)
x = np.linspace(data.min(), data.max(), 100)
axes[0].plot(x, stats.norm.pdf(x, data.mean(), data.std()))
axes[0].set_title('Histogram + Normal Curve')

# Q-Q Plot
stats.probplot(data, dist="norm", plot=axes[1])
axes[1].set_title('Q-Q Plot')
plt.tight_layout()
plt.show()`
              }
            },
            {
              name: "Shapiro-Wilk", type: "test",
              note: {
                desc: "Gold standard normality test for n < 2000. Tests H₀: data is drawn from a normal distribution. Significant p-value = reject normality. CAUTION: at n > 5000, will flag practically irrelevant deviations as significant. Always pair with Q-Q plot — the visual tells you the SHAPE; Shapiro-Wilk tells you if it's detectable.",
                math: `W = (Σ aᵢ x₍ᵢ₎)² / Σ(xᵢ - x̄)²

where:
x₍ᵢ₎ = i-th order statistic (sorted values)
aᵢ = coefficients derived from expected values
     of order statistics of standard normal

W ranges 0 to 1.
W close to 1 → data is approximately normal
p < 0.05 → reject normality`,
                code: `from scipy.stats import shapiro

for col in num_cols:
    data = df[col].dropna()
    if len(data) > 2000:
        data = data.sample(2000, random_state=42)
    W, p = shapiro(data)
    verdict = "✓ Normal" if p > 0.05 else "✗ Non-normal"
    print(f"{col}: W={W:.4f}, p={p:.4f} → {verdict}")`
              }
            },
            {
              name: "Jarque-Bera", type: "test",
              note: {
                desc: "Tests normality by specifically measuring skewness and excess kurtosis. Better than Shapiro-Wilk for large samples. Tells you WHY normality fails: is it the skew? The kurtosis? Both? This shapes your transformation choice — skewness points to log/sqrt; kurtosis points to other approaches.",
                math: `JB = (n/6) × [S² + (K²/4)]

where:
S = skewness = (1/n)Σ[(xᵢ-x̄)/σ]³
K = excess kurtosis = (1/n)Σ[(xᵢ-x̄)/σ]⁴ - 3

Under H₀ (normality): JB ~ χ²(2)

Interpretation:
S = 0, K = 0 → perfectly normal
S > 0 → right skew (log transform likely)
K > 0 → heavy tails (leptokurtic)`,
                code: `from scipy.stats import jarque_bera, skew, kurtosis

for col in num_cols:
    data = df[col].dropna()
    jb, p = jarque_bera(data)
    s = skew(data)
    k = kurtosis(data)  # excess kurtosis
    print(f"{col}: JB={jb:.2f}, p={p:.4f}, "
          f"skew={s:.3f}, kurt={k:.3f}")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "TRANSFORM if normality violated and parametric model needed. Right skew → log(x) or sqrt(x). Left skew → square or cube. Severe skew → Box-Cox finds optimal power. USE NON-PARAMETRIC if transformation doesn't help. ACCEPT as-is if model doesn't require normality (tree models) or sample is large (CLT robustness at n > 30).",
                math: `Box-Cox transformation:
y(λ) = (yᵓ - 1)/λ  if λ ≠ 0
     = ln(y)        if λ = 0

λ is found by maximum likelihood.
Common values: λ=0 (log), λ=0.5 (sqrt),
λ=-1 (reciprocal), λ=1 (no transform)`,
                code: `from scipy.stats import boxcox, shapiro

for col in num_cols:
    data = df[col].dropna()
    if data.min() > 0:  # Box-Cox requires positive values
        transformed, lam = boxcox(data)
        W_orig, p_orig = shapiro(data[:2000])
        W_trans, p_trans = shapiro(transformed[:2000])
        print(f"{col}: λ={lam:.3f}")
        print(f"  Before: W={W_orig:.4f}, p={p_orig:.4f}")
        print(f"  After:  W={W_trans:.4f}, p={p_trans:.4f}")`
              }
            },
          ]
        },
        {
          name: "Homoscedasticity", type: "category",
          note: {
            desc: "Variance of residuals must be CONSTANT across all predictor levels. Heteroscedasticity leaves coefficients unbiased but corrupts standard errors — making confidence intervals and p-values unreliable. Your model looks fine while being silently misleading about uncertainty.",
            math: "H₀: Var(εᵢ) = σ² for all i (constant). H₁: Var(εᵢ) varies with X. Violation inflates standard errors non-uniformly, invalidating inference.",
            code: `import statsmodels.api as sm

X = sm.add_constant(df[num_cols].dropna())
y = df[target][X.index]
model = sm.OLS(y, X).fit()

fitted = model.fittedvalues
residuals = model.resid

plt.scatter(fitted, residuals, alpha=0.3)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel("Fitted Values")
plt.ylabel("Residuals")
plt.title("Residual vs Fitted Plot")
plt.show()`
          },
          children: [
            {
              name: "Residual vs Fitted Plot", type: "test",
              note: {
                desc: "Primary visual diagnostic. Plots residuals (actual minus predicted) against fitted values. LOOK FOR: random horizontal band = homoscedastic. Funnel/cone expanding = heteroscedastic. Curve = linearity violation too. Points far from zero at edges = influential outliers.",
                math: `Residualᵢ = yᵢ - ŷᵢ

For homoscedasticity:
Var(εᵢ) = σ² (constant)
E[εᵢ] = 0 (zero mean)
εᵢ ~ N(0, σ²)

In the plot, you want to see:
• No systematic pattern
• Spread roughly equal across all ŷᵢ
• Points symmetrically around y=0`,
                code: `import statsmodels.api as sm
import matplotlib.pyplot as plt
import numpy as np

# Fit model and extract residuals
model = sm.OLS(y, X).fit()
fitted = model.fittedvalues
residuals = model.resid

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Residual vs Fitted
axes[0].scatter(fitted, residuals, alpha=0.3, s=20)
axes[0].axhline(0, color='red', lw=2, linestyle='--')
z = np.polyfit(fitted, residuals, 2)
p = np.poly1d(z)
axes[0].plot(sorted(fitted), p(sorted(fitted)), 'orange', lw=2)
axes[0].set_title("Residual vs Fitted")

# Scale-Location (sqrt of |standardised residuals|)
axes[1].scatter(fitted, np.sqrt(np.abs(residuals)), alpha=0.3, s=20)
axes[1].set_title("Scale-Location Plot")
plt.tight_layout(); plt.show()`
              }
            },
            {
              name: "Breusch-Pagan Test", type: "test",
              note: {
                desc: "Default statistical test for heteroscedasticity. Regresses squared residuals on predictors — if predictors explain variance in residuals, variance is not constant. Assumes LINEAR relationship between variance and predictors. If that assumption fails, use White's Test.",
                math: `Step 1: fit OLS, obtain residuals eᵢ
Step 2: regress eᵢ² on predictors X
Step 3: LM = n × R² from step 2

Under H₀ (homoscedasticity):
LM ~ χ²(k) where k = number of predictors

p < 0.05 → reject H₀ → heteroscedasticity
         → standard errors are unreliable`,
                code: `from statsmodels.stats.diagnostic import het_breuschpagan

model = sm.OLS(y, X).fit()
lm, lm_p, fval, f_p = het_breuschpagan(model.resid, model.model.exog)

print(f"Breusch-Pagan: LM={lm:.3f}, p={lm_p:.4f}")
print(f"F-stat: {fval:.3f}, p={f_p:.4f}")
if lm_p < 0.05:
    print("⚠ Heteroscedasticity detected")
else:
    print("✓ Homoscedasticity holds")`
              }
            },
            {
              name: "White's Test", type: "test",
              note: {
                desc: "More general than Breusch-Pagan — includes squared terms and cross-products to detect NON-LINEAR heteroscedasticity. Use when BP is borderline or residual plot shows complex patterns. Lower power than BP due to more parameters estimated. Use BP first; reach for White's as a thorough secondary check.",
                math: `White's test extends Breusch-Pagan:
Regress eᵢ² on Xⱼ, Xⱼ², and Xⱼ × Xₖ
(all original predictors, their squares,
and all pairwise interaction terms)

LM = n × R²
LM ~ χ²(p) where p = number of regressors
in the auxiliary regression

Detects both linear and non-linear
forms of heteroscedasticity.`,
                code: `from statsmodels.stats.diagnostic import het_white

model = sm.OLS(y, X).fit()
lm, lm_p, fval, f_p = het_white(model.resid, model.model.exog)

print(f"White's Test: LM={lm:.3f}, p={lm_p:.4f}")
if lm_p < 0.05:
    print("⚠ Heteroscedasticity detected (possibly non-linear)")
else:
    print("✓ No heteroscedasticity detected")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "MILD: log transform the target. MODERATE: Weighted Least Squares (WLS). SEVERE: Robust standard errors (HC3). CANNOT FIX: switch to tree-based models. Note: a log transform often fixes both heteroscedasticity AND non-normality simultaneously — always recheck both after transforming.",
                math: `WLS objective:
minimise Σ wᵢ(yᵢ - ŷᵢ)²
where wᵢ = 1/Var(εᵢ) (inverse variance weights)

HC3 Robust standard errors:
Var̂_HC3(β̂) = (X'X)⁻¹ [Σ eᵢ²/(1-hᵢ)² xᵢxᵢ'] (X'X)⁻¹
where hᵢ = leverage of observation i
Gives valid inference even with heteroscedasticity`,
                code: `# Option 1: Log transform target
df['log_target'] = np.log1p(df[target])

# Option 2: Robust standard errors (HC3)
model_robust = sm.OLS(y, X).fit(cov_type='HC3')
print(model_robust.summary())

# Option 3: WLS with inverse-variance weights
model_init = sm.OLS(y, X).fit()
weights = 1 / (model_init.resid**2)
model_wls = sm.WLS(y, X, weights=weights).fit()
print(model_wls.summary())`
              }
            },
          ]
        },
        {
          name: "Linearity Assessment", type: "category",
          note: {
            desc: "Relationship between inputs and target must follow a straight line for linear models. Non-linearity won't break your model — it will produce plausible-looking but systematically wrong coefficients. Your model will misrepresent the relationship in a structured, predictable way.",
            math: "Linear model assumption: E[Y|X] = β₀ + β₁X₁ + ... + βₖXₖ. If the true relationship is f(X) ≠ linear, OLS estimates are BIASED — not just noisy.",
            code: `# LOESS smoothed scatter plots for each predictor vs target
import statsmodels.nonparametric.smoothers_lowess as lowess_sm

for col in num_cols[:4]:  # first 4 for illustration
    data = df[[col, target]].dropna()
    x, y = data[col].values, data[target].values
    smoothed = lowess_sm.lowess(y, x, frac=0.3)
    plt.scatter(x, y, alpha=0.2, s=10)
    plt.plot(smoothed[:,0], smoothed[:,1], 'r-', lw=2)
    plt.title(f"{col} vs {target} with LOWESS")
    plt.show()`
          },
          children: [
            {
              name: "LOWESS Curve", type: "test",
              note: {
                desc: "Locally Weighted Scatterplot Smoothing fits a smooth curve with no assumptions about shape. If the LOWESS curve is straight → linearity holds. If it bends/curves/changes direction → linearity is violated and the shape tells you what fix to apply. U-shape = polynomial. Exponential = log transform.",
                math: `At each point x₀, LOWESS fits a weighted
local regression using nearby points:
minimise Σ wᵢ(x₀)(yᵢ - β₀ - β₁xᵢ)²

Weights: wᵢ(x₀) = K(|xᵢ-x₀|/h)
K = tricube kernel: (1-u³)³ for |u| < 1

Bandwidth h controls smoothness.
frac parameter = proportion of data used
in each local fit (default ~0.3).`,
                code: `import statsmodels.nonparametric.smoothers_lowess as lowess_sm
import matplotlib.pyplot as plt

for col in num_cols:
    if col != target:
        data = df[[col, target]].dropna().sort_values(col)
        x = data[col].values
        y = data[target].values

        smoothed = lowess_sm.lowess(y, x, frac=0.3, return_sorted=True)

        plt.figure(figsize=(8, 4))
        plt.scatter(x, y, alpha=0.15, s=10, color='steelblue')
        plt.plot(smoothed[:,0], smoothed[:,1], 'r-', lw=2.5, label='LOWESS')
        plt.title(f"LOWESS: {col} vs {target}")
        plt.legend(); plt.show()`
              }
            },
            {
              name: "Ramsey RESET Test", type: "test",
              note: {
                desc: "Formally tests whether adding polynomial terms of fitted values improves model fit. If yes — the original linear model was missing non-linear structure. A single decisive p-value rather than visual interpretation. Significant result = go add polynomial features or transform.",
                math: `Step 1: Fit original model, obtain ŷᵢ
Step 2: Add polynomial terms ŷᵢ², ŷᵢ³, ŷᵢ⁴
        to the original model
Step 3: Test joint significance of new terms:
        H₀: γ₂ = γ₃ = γ₄ = 0 (no improvement)

F = [(R²_augmented - R²_original)/q] /
    [(1 - R²_augmented)/(n-k-q-1)]

p < 0.05 → reject H₀ → linearity violated`,
                code: `from statsmodels.stats.diagnostic import linear_reset

model = sm.OLS(y, X).fit()
reset_result = linear_reset(model, power=3, use_f=True)

print(f"RESET Test: F={reset_result.statistic:.3f}, "
      f"p={reset_result.pvalue:.4f}")

if reset_result.pvalue < 0.05:
    print("⚠ Linearity violated — consider polynomial features")
else:
    print("✓ No evidence of non-linearity")`
              }
            },
            {
              name: "Pearson vs Spearman", type: "test",
              note: {
                desc: "Free diagnostic requiring no extra computation. Pearson = linear association. Spearman = monotonic association. If Spearman >> Pearson, relationship is curved but consistently directional. If both weak, relationship may be U-shaped. Compare these numbers you already have from Checkpoint 1.",
                math: `Pearson r: measures linear association
Spearman ρ: measures monotonic association

Diagnostic:
|ρ| ≈ |r|        → linear relationship ✓
|ρ| >> |r|       → monotonic but curved ⚠
Both near zero   → non-monotonic (U-shape?)

Threshold: if |ρ - r| > 0.1, flag for
linearity investigation in Checkpoint 2`,
                code: `from scipy.stats import pearsonr, spearmanr

print("Feature | Pearson_r | Spearman_ρ | Difference | Flag")
print("-" * 65)

for col in num_cols:
    if col != target:
        data = df[[col, target]].dropna()
        r, _ = pearsonr(data[col], data[target])
        rho, _ = spearmanr(data[col], data[target])
        diff = abs(rho) - abs(r)
        flag = "⚠ CURVED" if diff > 0.1 else ""
        print(f"{col:<20} {r:>8.3f}   {rho:>9.3f}   {diff:>9.3f}  {flag}")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "MILD CURVE: add polynomial features (X², X³). EXPONENTIAL growth: log transform the variable. U-SHAPED: polynomial terms or binning. COMPLEX/UNKNOWN SHAPE: switch to tree-based models or GAMs which handle non-linearity natively. Always recheck residual vs fitted plot after transformation.",
                math: `Polynomial feature approach:
ŷ = β₀ + β₁X + β₂X² + β₃X³

Box-Cox on predictor (right skew):
X_transformed = (Xᵓ - 1)/λ  [λ found by MLE]

Interaction + polynomial:
ŷ = β₀ + β₁X₁ + β₂X₁² + β₃X₂ + β₄X₁X₂
(still a linear model — linear in PARAMETERS)`,
                code: `from sklearn.preprocessing import PolynomialFeatures
import numpy as np

# Add polynomial features for a curved predictor
col = 'your_curved_feature'
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(df[[col]])

# Or log transform
df[f'log_{col}'] = np.log1p(df[col])

# Verify improvement with RESET after transformation
model_new = sm.OLS(y, sm.add_constant(X_poly)).fit()
reset_new = linear_reset(model_new, power=3, use_f=True)
print(f"After polynomial: RESET p={reset_new.pvalue:.4f}")`
              }
            },
          ]
        },
      ]
    },
    {
      name: "Checkpoint 3", subtitle: "Variable Relationships", type: "checkpoint",
      note: {
        desc: "How do your variables relate to EACH OTHER? Three problems: multicollinearity (variables too similar), interaction effects (variables modifying each other's influence), confounding (a hidden variable driving apparent relationships). This is about the internal geometry of your predictor space.",
        math: "The design matrix X must have full column rank for OLS to have a unique solution: (X'X)⁻¹ must exist. Multicollinearity makes X'X ill-conditioned — its determinant approaches zero, inflating all standard errors.",
        code: `# Full correlation heatmap of predictors
fig, ax = plt.subplots(figsize=(14, 10))
corr = df[num_cols].corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, mask=mask, annot=True, fmt='.2f',
            cmap='RdBu_r', center=0, ax=ax)
plt.title("Predictor Correlation Matrix")
plt.show()`
      },
      children: [
        {
          name: "Multicollinearity", type: "category",
          note: {
            desc: "High correlation between INPUT variables — not with the target. Coefficients become unstable, standard errors inflate, variable importance is misattributed. Model may predict well but explain nothing correctly. Especially dangerous for inference-focused work.",
            math: "When X'X is nearly singular (det ≈ 0), the OLS solution β̂ = (X'X)⁻¹X'y becomes numerically unstable. Small changes in data cause large coefficient swings.",
            code: `# Visualise with a clustered heatmap
import seaborn as sns
sns.clustermap(df[num_cols].corr(), cmap='RdBu_r',
               center=0, figsize=(10, 10))
plt.title("Clustered Correlation Heatmap")
plt.show()`
          },
          children: [
            {
              name: "Correlation Matrix", type: "test",
              note: {
                desc: "Quick first pass — flags pairwise collinearity. Flag |r| > 0.8. But CANNOT detect group collinearity: C might be almost perfectly reconstructable from A+B even when all pairwise correlations are moderate. Always follow with VIF.",
                math: `rᵢⱼ = Σ(xᵢ - x̄ᵢ)(xⱼ - x̄ⱼ) / √[Σ(xᵢ-x̄ᵢ)² × Σ(xⱼ-x̄ⱼ)²]

Rule of thumb thresholds:
|r| > 0.8 → flag for review
|r| > 0.9 → serious collinearity
|r| = 1.0 → perfect collinearity
            (matrix is singular, OLS fails)`,
                code: `# Find all high-correlation pairs
corr_matrix = df[num_cols].corr().abs()
upper = corr_matrix.where(
    np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
)

high_corr = [(col, row, upper.loc[row, col])
             for col in upper.columns
             for row in upper.index
             if upper.loc[row, col] > 0.8]

for feat1, feat2, r in sorted(high_corr, key=lambda x: -x[2]):
    print(f"{feat1} ↔ {feat2}: r={r:.3f}")`
              }
            },
            {
              name: "VIF Analysis", type: "test",
              note: {
                desc: "Definitive multicollinearity test. Measures how well each variable can be predicted by ALL others. VIF = 1/tolerance where tolerance = 1 - R². The key advantage: catches GROUP collinearity that pairwise correlations miss entirely.",
                math: `VIF_j = 1 / (1 - R²_j)

R²_j = R² from regressing Xⱼ on all other X

Tolerance_j = 1 / VIF_j = 1 - R²_j

VIF = 1   → Xⱼ has no linear relationship
           with other predictors
VIF = 5   → Xⱼ is 80% explained by others
VIF = 10  → Xⱼ is 90% explained by others
           → standard errors inflated ~3.2×`,
                code: `from statsmodels.stats.outliers_influence import variance_inflation_factor
import pandas as pd

def compute_vif(df, cols):
    X = df[cols].dropna()
    X = sm.add_constant(X)
    vif = pd.DataFrame({
        'feature': X.columns,
        'VIF': [variance_inflation_factor(X.values, i)
                for i in range(X.shape[1])]
    }).iloc[1:]  # drop constant row
    return vif.sort_values('VIF', ascending=False)

vif_table = compute_vif(df, num_cols)
print(vif_table)
print("\nHigh VIF (>10):")
print(vif_table[vif_table['VIF'] > 10])`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "DROP ONE: keep whichever collinear variable correlates more strongly with target. COMBINE: ratio, average, or PCA component. RIDGE REGRESSION: penalises large coefficients — naturally handles collinearity without removing variables. LASSO: zeros out redundant variables via L1 penalty.",
                math: `Ridge Regression (L2):
minimise: ||y - Xβ||² + λ||β||²
Solution: β̂_ridge = (X'X + λI)⁻¹X'y
λI ensures X'X+λI is always invertible
even with perfect multicollinearity.

Lasso (L1):
minimise: ||y - Xβ||² + λΣ|βⱼ|
→ some coefficients shrink to exactly zero
→ performs automatic variable selection`,
                code: `from sklearn.linear_model import Ridge, Lasso, RidgeCV
from sklearn.preprocessing import StandardScaler

# Scale before regularisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[num_cols].dropna())

# Ridge — find best lambda with cross-validation
alphas = [0.01, 0.1, 1, 10, 100]
ridge_cv = RidgeCV(alphas=alphas, cv=5)
ridge_cv.fit(X_scaled, y)
print(f"Best Ridge alpha: {ridge_cv.alpha_}")
print(pd.Series(ridge_cv.coef_, index=num_cols))`
              }
            },
          ]
        },
        {
          name: "Interaction Effects", type: "category",
          note: {
            desc: "The effect of variable A on target CHANGES depending on the value of variable B. Most models ignore interactions unless you explicitly engineer them. Tree-based models detect them automatically via splits.",
            math: "Interaction model: E[Y] = β₀ + β₁X₁ + β₂X₂ + β₃(X₁×X₂). The coefficient β₃ represents how the marginal effect of X₁ changes with X₂: ∂E[Y]/∂X₁ = β₁ + β₃X₂.",
            code: `# Quick interaction screening with heatmap of group means
# (for categorical × continuous interactions)
for cat in cat_cols[:2]:
    pivot = df.groupby(cat)[num_cols[:4]].mean()
    sns.heatmap(pivot.T, cmap='YlOrRd', annot=True)
    plt.title(f"Group means by {cat}")
    plt.show()`
          },
          children: [
            {
              name: "Interaction Plots", type: "test",
              note: {
                desc: "Display the relationship between a continuous predictor and target separately for each group of a categorical variable. PARALLEL LINES = no interaction. CROSSING or DIVERGING lines = interaction present. Crossing lines mean the effect actually reverses direction across groups.",
                math: `For interaction between X₁ (continuous)
and X₂ (categorical with groups g):

Slope for group g:
∂E[Y]/∂X₁|_{X₂=g} = β₁ + β₃ × g

Parallel lines: slope is same for all g
→ β₃ ≈ 0 (no interaction)

Crossing lines: slope changes sign
→ β₃ significantly non-zero (interaction)`,
                code: `import matplotlib.pyplot as plt

def interaction_plot(df, cont_var, cat_var, target, bins=5):
    df_copy = df.copy()
    df_copy['x_bin'] = pd.cut(df_copy[cont_var], bins=bins)
    grouped = df_copy.groupby(['x_bin', cat_var])[target].mean().reset_index()
    grouped['x_mid'] = grouped['x_bin'].apply(lambda x: x.mid)

    for group in grouped[cat_var].unique():
        sub = grouped[grouped[cat_var] == group]
        plt.plot(sub['x_mid'], sub[target], marker='o', label=str(group))

    plt.xlabel(cont_var); plt.ylabel(f"Mean {target}")
    plt.title(f"Interaction: {cont_var} × {cat_var}")
    plt.legend(); plt.show()

interaction_plot(df, 'income', 'employment_type', target)`
              }
            },
            {
              name: "Multiplication Term (X1×X2)", type: "test",
              note: {
                desc: "Create a product variable X1×X2 and add to the model. If the coefficient is significant, the interaction is real. HIERARCHY PRINCIPLE: always include both constituent main effects when adding an interaction term. Never include an interaction without its main effects.",
                math: `Full interaction model:
ŷ = β₀ + β₁X₁ + β₂X₂ + β₃(X₁X₂)

∂ŷ/∂X₁ = β₁ + β₃X₂
(marginal effect of X₁ depends on X₂)

t-test for β₃: H₀: β₃ = 0 (no interaction)
Reject H₀ if p < 0.05

Note: standardise X₁ and X₂ before
creating interaction term to reduce
multicollinearity between X₁, X₂, X₁X₂`,
                code: `import statsmodels.api as sm
from sklearn.preprocessing import StandardScaler

# Standardise before creating interaction
scaler = StandardScaler()
df['X1_scaled'] = scaler.fit_transform(df[['X1']])
df['X2_scaled'] = scaler.fit_transform(df[['X2']])
df['X1_X2'] = df['X1_scaled'] * df['X2_scaled']

X_interact = sm.add_constant(
    df[['X1_scaled', 'X2_scaled', 'X1_X2']].dropna()
)
y_aligned = df[target][X_interact.index]

model = sm.OLS(y_aligned, X_interact).fit()
print(model.summary())
print("\\nInteraction term p-value:", model.pvalues['X1_X2'])`
              }
            },
            {
              name: "Likelihood Ratio Test", type: "test",
              note: {
                desc: "Model comparison approach. Fit two models: without and with interaction term. LRT tests whether the improvement in fit is statistically significant. More rigorous than just checking coefficient p-value, especially with correlated predictors.",
                math: `LR = -2 × [logL(M₀) - logL(M₁)]

where:
M₀ = model WITHOUT interaction (null)
M₁ = model WITH interaction (alternative)

LR ~ χ²(q) where q = df difference
(number of interaction terms added)

p < 0.05 → M₁ significantly better
         → interaction is real`,
                code: `from scipy.stats import chi2

# For OLS: compare using F-test
model_base = sm.OLS(y, sm.add_constant(df[['X1_scaled','X2_scaled']].dropna())).fit()
model_inter = sm.OLS(y, sm.add_constant(df[['X1_scaled','X2_scaled','X1_X2']].dropna())).fit()

# Likelihood Ratio Test
lr_stat = -2 * (model_base.llf - model_inter.llf)
df_diff = model_inter.df_model - model_base.df_model
p_val = 1 - chi2.cdf(lr_stat, df=df_diff)

print(f"LR statistic: {lr_stat:.3f}")
print(f"Degrees of freedom: {df_diff}")
print(f"p-value: {p_val:.4f}")
print("→ Interaction significant" if p_val < 0.05 else "→ No significant interaction")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "SIGNIFICANT: include X1×X2 as an explicit engineered feature alongside both main effects. VISUAL CROSSING but not significant: flag, revisit with more data. TREE MODELS detect interactions automatically — consider them if data is rich with interactions.",
                math: `When β₃ is significant:
New model: ŷ = β₀ + β₁X₁ + β₂X₂ + β₃X₁X₂

For categorical X₂ (k groups):
Create k-1 interaction dummies:
X₁ × I(X₂=g₁), X₁ × I(X₂=g₂), ...

For continuous × continuous:
Centre both variables before multiplying
to reduce multicollinearity in the
interaction term.`,
                code: `# Engineer interaction for modelling
from sklearn.preprocessing import StandardScaler

def add_interactions(df, cont_vars, cat_vars, target):
    df_out = df.copy()
    # Continuous × Continuous
    for i, v1 in enumerate(cont_vars):
        for v2 in cont_vars[i+1:]:
            df_out[f'{v1}_x_{v2}'] = (
                (df[v1] - df[v1].mean()) *
                (df[v2] - df[v2].mean())
            )
    # Continuous × Categorical (dummies)
    for cont in cont_vars:
        dummies = pd.get_dummies(df[cat_vars[0]], drop_first=True)
        for col in dummies.columns:
            df_out[f'{cont}_x_{col}'] = df[cont] * dummies[col]
    return df_out`
              }
            },
          ]
        },
        {
          name: "Confounding", type: "category",
          note: {
            desc: "A third variable C drives both X and Y, creating a spurious or exaggerated X→Y relationship. If C is in your dataset but not controlled for, your model misattributes its effect. If C is absent entirely, you have omitted variable bias — systematic wrongness you may never detect.",
            math: "Omitted Variable Bias: β̂₁ = β₁ + β₂ × δ₁₂ where δ₁₂ is the regression of omitted variable Z on included variable X. The bias is non-zero whenever Z affects Y (β₂ ≠ 0) AND Z correlates with X (δ₁₂ ≠ 0).",
            code: `# Partial correlation matrix (controlling for all others)
from scipy.stats import pearsonr
import pingouin as pg

# Compute partial correlations controlling for a third variable
result = pg.partial_corr(data=df, x='X1', y=target, covar='potential_confounder')
print(result)`
          },
          children: [
            {
              name: "Correlation Triangle", type: "test",
              note: {
                desc: "Structured thought process: (1) A correlates with B? (2) C correlates with A? (3) C correlates with B? If all yes, does A→B WEAKEN when controlling for C? Weakening = confounding. Complete disappearance = spurious relationship — was entirely driven by C.",
                math: `Confounding conditions (all must hold):
1. C → Y (C affects target)
2. C → X (C correlates with predictor)
3. C is not on the causal pathway X→Y

Test: compare:
rXY (raw correlation)  vs
rXY.C (partial correlation controlling for C)

If rXY.C << rXY → C confounds X→Y
If rXY.C ≈ 0  → relationship was entirely spurious
If rXY.C ≈ rXY → C is not a confounder`,
                code: `from scipy.stats import pearsonr

def correlation_triangle(df, x, y, c):
    r_xy, p_xy = pearsonr(df[x].dropna(), df[y][df[x].notna()])
    r_xc, p_xc = pearsonr(df[x].dropna(), df[c][df[x].notna()])
    r_yc, p_yc = pearsonr(df[y].dropna(), df[c][df[y].notna()])

    print(f"r({x},{y}) = {r_xy:.3f} (p={p_xy:.4f})")
    print(f"r({x},{c}) = {r_xc:.3f} (p={p_xc:.4f})")
    print(f"r({y},{c}) = {r_yc:.3f} (p={p_yc:.4f})")

    if all([abs(r_xy)>0.1, abs(r_xc)>0.1, abs(r_yc)>0.1]):
        print(f"⚠ {c} is a candidate confounder")

correlation_triangle(df, 'X1', target, 'potential_confounder')`
              }
            },
            {
              name: "Partial Correlation", type: "test",
              note: {
                desc: "Measures correlation between A and B AFTER removing the influence of C from both. If partial correlation drops substantially vs raw correlation, C was confounding. If drops to near zero, the A→B relationship was spurious. The definitive quantitative test for confounding.",
                math: `Partial correlation r_AB.C:

r_AB.C = (r_AB - r_AC × r_BC) /
         √[(1-r_AC²)(1-r_BC²)]

where:
r_AB = raw Pearson correlation A↔B
r_AC = correlation A↔C
r_BC = correlation B↔C

Interpretation:
|r_AB.C| << |r_AB| → C confounds A↔B
|r_AB.C| ≈ 0      → relationship was spurious
|r_AB.C| ≈ |r_AB| → C is not a confounder`,
                code: `import pingouin as pg

# Partial correlation: X1 and target controlling for confounder
result = pg.partial_corr(
    data=df.dropna(),
    x='X1',
    y=target,
    covar=['confounder1', 'confounder2']  # list of controls
)
print(result[['n', 'r', 'CI95%', 'p-val']])

# Compare raw vs partial
raw_r, _ = pearsonr(df['X1'].dropna(), df[target].dropna())
partial_r = result['r'].values[0]
print(f"\\nRaw r: {raw_r:.3f}")
print(f"Partial r (controlling for confounder): {partial_r:.3f}")
print(f"Attenuation: {abs(raw_r) - abs(partial_r):.3f}")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "CONFOUNDER IN DATASET: add as a control variable. CONFOUNDER ABSENT: acknowledge as limitation — your coefficients have omitted variable bias. SPURIOUS RELATIONSHIP: drop one of the two variables. PRACTICAL NOTE: especially critical in business settings where coefficients are interpreted causally.",
                math: `Adding confounder C as control:
New model: Y = β₀ + β₁X + β₂C + ε

Now β₁ estimates the PARTIAL effect of X
on Y, holding C constant — unconfounded.

Omitted variable bias formula:
β̂₁_biased = β₁_true + β₂ × (X'X)⁻¹X'C
                              └─ this is δ₁
OVB direction depends on sign of β₂ × δ₁:
same sign → upward bias
diff sign → downward bias`,
                code: `# Model comparison: with and without confounder
model_without = sm.OLS(y, sm.add_constant(df[['X1']].dropna())).fit()
model_with = sm.OLS(y, sm.add_constant(df[['X1', 'confounder']].dropna())).fit()

print("Without confounder:")
print(f"  X1 coefficient: {model_without.params['X1']:.4f}")
print(f"  X1 p-value:     {model_without.pvalues['X1']:.4f}")
print()
print("With confounder controlled:")
print(f"  X1 coefficient: {model_with.params['X1']:.4f}")
print(f"  X1 p-value:     {model_with.pvalues['X1']:.4f}")
print(f"  Coefficient change: {model_without.params['X1'] - model_with.params['X1']:.4f}")`
              }
            },
          ]
        },
      ]
    },
    {
      name: "Checkpoint 4", subtitle: "Target Variable Behaviour", type: "checkpoint",
      note: {
        desc: "Every prior checkpoint examined input variables. This examines what you're predicting. Your target variable drives every downstream modelling decision. Four areas: distribution (model family), class imbalance (sampling strategy), outliers (influence on fit), leakage (production validity).",
        math: "The target's distribution defines the likelihood function your model optimises. Normal target → Gaussian likelihood (OLS). Binary → Bernoulli likelihood (logistic). Count → Poisson likelihood. Wrong choice = wrong optimisation objective.",
        code: `# Target overview
print(df[target].describe())
print(f"\nSkewness: {df[target].skew():.3f}")
print(f"Kurtosis: {df[target].kurtosis():.3f}")
print(f"Missing: {df[target].isnull().sum()}")

df[target].hist(bins=50)
plt.title(f"Target: {target}")
plt.show()`
      },
      children: [
        {
          name: "Target Distribution", type: "category",
          note: {
            desc: "Shape of the target determines model family. Most people default to linear/logistic without checking. A count variable modelled with linear regression can predict negative counts. Zero-inflated data needs a two-part model. Get this right before everything else.",
            math: "Model families match likelihood functions to data generating processes. OLS minimises Σ(yᵢ-ŷᵢ)² assuming Y~Normal. Logistic maximises Bernoulli log-likelihood. Poisson maximises Σ(yᵢlog(ŷᵢ)-ŷᵢ).",
            code: `import scipy.stats as stats

# Test fit against multiple distributions
data = df[target].dropna()

for dist_name in ['norm', 'lognorm', 'expon', 'gamma']:
    dist = getattr(stats, dist_name)
    params = dist.fit(data)
    ks_stat, p = stats.kstest(data, dist_name, params)
    print(f"{dist_name}: KS={ks_stat:.4f}, p={p:.4f}")`
          },
          children: [
            {
              name: "Histogram + Skewness", type: "test",
              note: {
                desc: "First visual of the target. Skewness statistic quantifies asymmetry. Look for: bell shape (linear OK), right skew (log transform), multimodality (subpopulations), spike at zero (zero-inflated model). Kurtosis tells you about tail thickness.",
                math: `Skewness (3rd standardised moment):
γ₁ = E[(X-μ)³] / σ³
= (1/n) Σ[(xᵢ-x̄)/s]³

Kurtosis (4th standardised moment):
γ₂ = E[(X-μ)⁴] / σ⁴ - 3  (excess kurtosis)
= (1/n) Σ[(xᵢ-x̄)/s]⁴ - 3

Thresholds:
|γ₁| < 0.5 → approximately symmetric
0.5–1      → moderately skewed
> 1        → highly skewed (transform needed)`,
                code: `import scipy.stats as stats
import matplotlib.pyplot as plt
import numpy as np

data = df[target].dropna()

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Histogram
axes[0].hist(data, bins=50, color='steelblue', edgecolor='white')
axes[0].set_title(f'Histogram (skew={data.skew():.2f})')

# Log-transformed
axes[1].hist(np.log1p(data[data>0]), bins=50, color='coral', edgecolor='white')
axes[1].set_title('Log(1+x) Transformed')

# Q-Q Plot
stats.probplot(data, dist="norm", plot=axes[2])
axes[2].set_title('Q-Q Plot')

plt.tight_layout(); plt.show()
print(f"Skewness: {data.skew():.3f}, Kurtosis: {data.kurtosis():.3f}")`
              }
            },
            {
              name: "Shapiro-Wilk on Target", type: "test",
              note: {
                desc: "Run on the target variable itself as early warning. If target is severely non-normal, residuals will likely be non-normal, violating linear regression's core assumption. Pre-flight check — catch the problem before training rather than after.",
                math: `Same formula as Shapiro-Wilk on inputs:
W = (Σ aᵢ x₍ᵢ₎)² / Σ(xᵢ - x̄)²

For linear regression residuals:
The GAUSS-MARKOV THEOREM guarantees
OLS is BLUE (Best Linear Unbiased Estimator)
without normality.

But for INFERENCE (confidence intervals,
hypothesis tests, prediction intervals),
normality of RESIDUALS is required.
Testing the target here is early warning
for likely residual non-normality.`,
                code: `from scipy.stats import shapiro, normaltest

data = df[target].dropna()

# Shapiro-Wilk (best for n < 2000)
sample = data.sample(min(2000, len(data)), random_state=42)
W, p_sw = shapiro(sample)
print(f"Shapiro-Wilk: W={W:.4f}, p={p_sw:.4f}")

# D'Agostino-Pearson (better for large samples)
stat, p_dp = normaltest(data)
print(f"D'Agostino-Pearson: stat={stat:.4f}, p={p_dp:.4f}")

if p_sw < 0.05:
    print("⚠ Target is non-normal — consider transformation")
    print(f"  Skewness: {data.skew():.3f}")
    print(f"  Recommendation: {'log transform' if data.skew() > 1 else 'Box-Cox'}")`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "NORMAL CONTINUOUS → linear regression. RIGHT SKEWED → log transform then recheck. BINARY → logistic regression, check imbalance. COUNT DATA → Poisson or Negative Binomial (linear regression on counts is wrong — can predict negatives). ZERO-INFLATED → two-part model. SURVIVAL → Cox proportional hazards.",
                math: `Model selection by target type:

Normal Y:     OLS → minimise Σ(y-ŷ)²
Binary Y:     Logistic → maximise Σ[y·log(p)+(1-y)·log(1-p)]
Count Y:      Poisson → maximise Σ[y·log(λ)-λ]
              Var(Y) = E[Y] (Poisson assumption)
Overdispersed count: Negative Binomial
              Var(Y) = μ + μ²/r

Log transform → new target: log(y)
Predictions back-transform: ŷ_original = e^ŷ_log`,
                code: `import statsmodels.api as sm
import statsmodels.formula.api as smf

# Continuous normal
model_ols = sm.OLS(y, X).fit()

# Count data — Poisson
model_poisson = smf.glm(
    formula=f'{target} ~ X1 + X2',
    data=df,
    family=sm.families.Poisson()
).fit()

# Count with overdispersion — Negative Binomial
model_nb = smf.glm(
    formula=f'{target} ~ X1 + X2',
    data=df,
    family=sm.families.NegativeBinomial()
).fit()

print("AIC comparison:")
print(f"OLS:  {model_ols.aic:.1f}")
print(f"Poisson: {model_poisson.aic:.1f}")
print(f"NegBin:  {model_nb.aic:.1f}")`
              }
            },
          ]
        },
        {
          name: "Class Imbalance", type: "category",
          note: {
            desc: "In classification, one class heavily outnumbers another. Model learns to predict majority class almost always. Achieves 99% accuracy by saying 'not fraud' every time while catching zero fraud. Accuracy becomes meaningless. Always change your evaluation metric when imbalance exists.",
            math: "Accuracy paradox: model predicting majority class always achieves accuracy = n_majority/n_total. For 95/5 imbalance, this is 95% accuracy with 0% recall on minority class.",
            code: `# Check class distribution
value_counts = df[target].value_counts()
print(value_counts)
print(f"\nImbalance ratio: {value_counts.max()/value_counts.min():.1f}:1")
value_counts.plot(kind='bar')
plt.title("Class Distribution")
plt.show()`
          },
          children: [
            {
              name: "Value Counts + Ratio", type: "test",
              note: {
                desc: "Simple value counts plus bar chart. Compute imbalance ratio. Thresholds: 60/40 = mild. 70/30 = moderate. 80/20 = concerning. 90/10 = severe. 95/5+ = extreme. Also check consistency across train/test split — without stratification you risk very few minority examples in test set.",
                math: `Imbalance ratio = n_majority / n_minority

Class weight (for sklearn):
w_i = n_samples / (n_classes × n_samples_class_i)

Example (80/20 imbalance):
w_majority = 1000/(2×800) = 0.625
w_minority = 1000/(2×200) = 2.5

Effective ratio after weighting = 1:1
Model penalised 4× more for missing
minority class.`,
                code: `from sklearn.model_selection import train_test_split
from collections import Counter

# Check distribution
print("Class distribution:")
print(df[target].value_counts(normalize=True).round(3))

# Stratified split — maintains class ratio in train/test
X_train, X_test, y_train, y_test = train_test_split(
    df.drop(columns=target),
    df[target],
    test_size=0.2,
    stratify=df[target],  # CRITICAL for imbalanced data
    random_state=42
)

print("\\nTrain distribution:")
print(Counter(y_train))
print("\\nTest distribution:")
print(Counter(y_test))`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "ALWAYS switch metric from accuracy to F1/AUC-ROC/PR-AUC. MILD (80/20): class weights first — zero data manipulation, most sklearn models support class_weight='balanced'. SEVERE: SMOTE generates synthetic minority samples by interpolating between neighbours. EXTREME: combine SMOTE + undersampling or reformulate as anomaly detection.",
                math: `Evaluation metrics for imbalance:

F1 = 2 × Precision × Recall / (Precision + Recall)
   = 2TP / (2TP + FP + FN)

AUC-ROC: area under ROC curve
  (TPR vs FPR at all thresholds)

Precision-Recall AUC: better than ROC
  when class imbalance is very severe

SMOTE interpolation:
x_new = xᵢ + λ × (x_neighbour - xᵢ)
where λ ~ Uniform(0,1)`,
                code: `from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier

# Step 1: Try class weights first (least invasive)
model_weighted = RandomForestClassifier(
    class_weight='balanced', random_state=42
)
model_weighted.fit(X_train, y_train)
print(classification_report(y_test, model_weighted.predict(X_test)))

# Step 2: SMOTE if weights not sufficient
smote = SMOTE(random_state=42, k_neighbors=5)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
print(f"After SMOTE: {Counter(y_resampled)}")

model_smote = RandomForestClassifier(random_state=42)
model_smote.fit(X_resampled, y_resampled)
print(classification_report(y_test, model_smote.predict(X_test)))`
              }
            },
          ]
        },
        {
          name: "Target Outliers", type: "category",
          note: {
            desc: "Outliers in Y are more dangerous than outliers in X. In linear regression, every extreme target value exerts gravitational pull on the entire regression line — distorting coefficients for EVERY variable. One influential observation can shift the model's entire understanding of reality.",
            math: "OLS minimises Σ(yᵢ-ŷᵢ)². An observation with extreme yᵢ contributes (yᵢ-ŷᵢ)² which can be enormous. The model moves its line toward the outlier to reduce this massive squared error — at the cost of fitting all other points worse.",
            code: `# Overview of target outliers
data = df[target].dropna()
Q1, Q3 = data.quantile(0.25), data.quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR
outliers = data[(data < lower) | (data > upper)]
print(f"Outliers: {len(outliers)} ({100*len(outliers)/len(data):.1f}%)")
data.plot(kind='box')
plt.show()`
          },
          children: [
            {
              name: "IQR Rule + Z-Score", type: "test",
              note: {
                desc: "IQR rule flags values beyond Q1 - 1.5×IQR and Q3 + 1.5×IQR. Z-score flags values beyond ±3 standard deviations. CAUTION: both assume roughly symmetric data. For skewed targets (income, sales), they over-flag legitimate high values. In skewed distributions, use Modified Z-Score or log-transform first.",
                math: `IQR Method:
IQR = Q3 - Q1
Lower fence = Q1 - 1.5 × IQR
Upper fence = Q3 + 1.5 × IQR
(Use 3× IQR for extreme outliers only)

Z-Score Method:
z = (xᵢ - x̄) / s
|z| > 3 → outlier (99.7% of normal data within)

Modified Z-Score (robust to skew):
Mᵢ = 0.6745 × (xᵢ - median) / MAD
MAD = median(|xᵢ - median|)
|Mᵢ| > 3.5 → outlier`,
                code: `import numpy as np
import scipy.stats as stats

data = df[target].dropna()

# IQR Method
Q1, Q3 = data.quantile(0.25), data.quantile(0.75)
IQR = Q3 - Q1
iqr_outliers = data[(data < Q1-1.5*IQR) | (data > Q3+1.5*IQR)]

# Z-Score
z_scores = np.abs(stats.zscore(data))
z_outliers = data[z_scores > 3]

# Modified Z-Score (robust)
MAD = np.median(np.abs(data - data.median()))
modified_z = 0.6745 * (data - data.median()) / MAD
mod_outliers = data[np.abs(modified_z) > 3.5]

print(f"IQR outliers:      {len(iqr_outliers)}")
print(f"Z-score outliers:  {len(z_outliers)}")
print(f"Modified Z (robust): {len(mod_outliers)}")`
              }
            },
            {
              name: "Cook's Distance", type: "test",
              note: {
                desc: "Measures how much the ENTIRE set of fitted values changes if you remove one observation. An observation can be extreme but low influence (follows the trend at extremes) or moderately extreme but massively influential (pulls the line away from most data). Cook's Distance catches the dangerous second type.",
                math: `Dᵢ = Σ(ŷⱼ - ŷⱼ₍ᵢ₎)² / (p × MSE)

where:
ŷⱼ     = fitted value with all observations
ŷⱼ₍ᵢ₎  = fitted value with observation i removed
p      = number of parameters
MSE    = mean squared error

Equivalently:
Dᵢ = (eᵢ² / p×MSE) × [hᵢ / (1-hᵢ)²]

hᵢ = leverage = xᵢ'(X'X)⁻¹xᵢ

Thresholds:
Dᵢ > 4/n  → investigate
Dᵢ > 1    → serious influence`,
                code: `import statsmodels.api as sm
import matplotlib.pyplot as plt
import numpy as np

model = sm.OLS(y, X).fit()
influence = model.get_influence()
cooks_d, _ = influence.cooks_distance

n = len(y)
threshold = 4 / n
high_influence = np.where(cooks_d > threshold)[0]

print(f"Observations with Cook's D > {threshold:.4f}: {len(high_influence)}")
print(f"Observations with Cook's D > 1: {sum(cooks_d > 1)}")

# Plot
plt.figure(figsize=(12, 4))
plt.stem(range(n), cooks_d, markerfmt=',', linefmt='steelblue', basefmt='gray')
plt.axhline(threshold, color='orange', linestyle='--', label=f'4/n={threshold:.4f}')
plt.axhline(1, color='red', linestyle='--', label='D=1')
plt.legend(); plt.title("Cook's Distance"); plt.show()`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "DATA ERROR: remove it, document removal. GENUINE EXTREME: winsorise (cap at percentile threshold). Many outliers one direction: log transform target. HIGH COOK'S DISTANCE: investigate — real-world explanation? Consider robust regression (Huber loss) which is less sensitive to influential points.",
                math: `Winsorisation:
Set xᵢ = Q(p_upper) if xᵢ > Q(p_upper)
Set xᵢ = Q(p_lower) if xᵢ < Q(p_lower)

Common: cap at 1st and 99th percentiles.
Preserves observation count while
limiting leverage of extreme values.

Huber Loss (robust regression):
L(r) = r²/2           if |r| ≤ δ
     = δ(|r| - δ/2)   if |r| > δ
Less sensitive to large residuals than OLS.`,
                code: `import numpy as np
from sklearn.linear_model import HuberRegressor

# Option 1: Winsorisation
lower_pct, upper_pct = 0.01, 0.99
lower_val = df[target].quantile(lower_pct)
upper_val = df[target].quantile(upper_pct)
df[f'{target}_winsorised'] = df[target].clip(lower_val, upper_val)

# Option 2: Log transform
df[f'{target}_log'] = np.log1p(df[target])

# Option 3: Huber Regression (robust to outliers)
huber = HuberRegressor(epsilon=1.35)  # epsilon=1.35 is standard
X_arr = df[num_cols].dropna().values
y_arr = df[target][df[num_cols].dropna().index].values
huber.fit(X_arr, y_arr)
print("Huber coefficients:", huber.coef_)`
              }
            },
          ]
        },
        {
          name: "Target Leakage", type: "category",
          note: {
            desc: "The most dangerous issue in pre-modelling. Variables containing information about the target that would NOT exist at prediction time in production. Produces spectacular development metrics and complete production failure. The model isn't learning a pattern — it's memorising the answer.",
            math: "Leakage creates a model where E[Y|X_leak] is near-perfect because X_leak IS Y (or a direct consequence of Y). The model learns to look up the answer rather than predict it — P(correct in test) → 1, P(correct in production) → baseline.",
            code: `# Feature importance check — leakage often shows
# as one feature dominating all others
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
importance = pd.Series(model.feature_importances_,
                       index=X_train.columns).sort_values(ascending=False)
print(importance.head(10))
importance.head(10).plot(kind='bar')
plt.title("Feature Importance (high single-feature dominance = leakage risk)")
plt.show()`
          },
          children: [
            {
              name: "Timeline Test", type: "test",
              note: {
                desc: "For every variable: AT THE MOMENT I NEED TO MAKE A PREDICTION — does this variable already exist? Predicting loan default: 'collection calls received' doesn't exist at approval time — LEAK. Predicting next month's churn: 'this month's support tickets' exists at prediction time — LEGITIMATE. Draw a literal timeline.",
                math: `Timeline Test framework:

t_prediction: moment model makes prediction
t_outcome:    moment target variable is realised

For each feature Xⱼ:
  t_Xⱼ = time when Xⱼ becomes available

VALID:   t_Xⱼ < t_prediction
LEAKAGE: t_Xⱼ ≥ t_outcome (consequence of Y)
         or t_Xⱼ > t_prediction (future info)

Even t_Xⱼ = t_outcome can be leakage
if Xⱼ is measured simultaneously with Y.`,
                code: `# Timeline test: systematic documentation
timeline_check = pd.DataFrame({
    'feature': df.columns.tolist(),
    'available_at_prediction': [
        True,   # income — known at loan application
        True,   # credit_score — known at application
        False,  # collection_calls — happens AFTER default
        True,   # employment_years — known at application
        False,  # days_past_due — consequence of default
    ],
    'notes': [
        'Applicant provides at application',
        'Pulled from credit bureau at application',
        '⚠ LEAKAGE: result of default event',
        'Applicant provides at application',
        '⚠ LEAKAGE: only exists if already defaulted',
    ]
})

leaks = timeline_check[~timeline_check['available_at_prediction']]
print("POTENTIAL LEAKS:")
print(leaks)`
              }
            },
            {
              name: "Suspiciously High Performance", type: "test",
              note: {
                desc: "Treat spectacular metrics as a RED FLAG, not a success. Realistic AUC benchmarks: fraud detection 0.85-0.92, churn 0.75-0.85, credit scoring 0.70-0.80. If you're significantly exceeding benchmarks OR one feature has 60%+ importance — investigate immediately.",
                math: `Leakage diagnostic signals:

1. AUC > 0.97 on a non-trivial problem → suspicious
2. Single feature importance > 60% → investigate
3. Remove top feature → AUC collapses → it was leaking
4. Model train AUC ≈ test AUC (unusual equality
   with high scores) → test set contaminated

Holdout validation:
If AUC in time-based holdout (future data)
drops dramatically vs random holdout →
temporal leakage is present`,
                code: `from sklearn.metrics import roc_auc_score
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

auc = roc_auc_score(y_test, model.predict_proba(X_test)[:,1])
print(f"AUC: {auc:.4f}")
if auc > 0.97:
    print("⚠ Suspiciously high AUC — investigate for leakage")

# Feature ablation test — remove top feature
top_feature = X_train.columns[model.feature_importances_.argmax()]
print(f"\nTop feature: {top_feature} ({model.feature_importances_.max():.1%})")
X_ablated = X_train.drop(columns=top_feature)
model2 = RandomForestClassifier(random_state=42).fit(X_ablated, y_train)
auc2 = roc_auc_score(y_test, model2.predict_proba(X_test.drop(columns=top_feature))[:,1])
print(f"AUC without {top_feature}: {auc2:.4f}")
print(f"AUC drop: {auc-auc2:.4f}" + (" ⚠ LEAKAGE LIKELY" if auc-auc2 > 0.1 else ""))`
              }
            },
            {
              name: "Decision", type: "decision",
              note: {
                desc: "DIRECT LEAKAGE: remove immediately, no exceptions. PROXY LEAKAGE: also remove — model will find and exploit indirect leakage. PIPELINE LEAKAGE: fix by fitting ALL preprocessing on training data only, never on full dataset. Scale → split → transform is wrong. Split → scale → transform is correct.",
                math: `Pipeline leakage — what goes wrong:

WRONG (data leakage):
scaler.fit(X_all)         ← test info leaks in
X_scaled = scaler.transform(X_all)
X_train, X_test = split(X_scaled)

CORRECT:
X_train, X_test = split(X_all)
scaler.fit(X_train)       ← fit on train only
X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)  ← apply only`,
                code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# CORRECT: use Pipeline — all transforms fit inside CV
# This guarantees no leakage even during cross-validation
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(random_state=42))
])

# Pipeline fits imputer and scaler on train fold only
# inside each CV split — no leakage possible
scores = cross_val_score(pipeline, X, y, cv=5,
                         scoring='roc_auc')
print(f"CV AUC: {scores.mean():.4f} ± {scores.std():.4f}")`
              }
            },
          ]
        },
      ]
    },
  ]
};

const TYPE_STYLES = {
  root: { fill: "#e2c97e", textColor: "#1a1a2e", stroke: "#e2c97e" },
  checkpoint: { fill: "#4f8ef7", textColor: "#ffffff", stroke: "#4f8ef7" },
  category: { fill: "#2a2a4a", textColor: "#c8d6f8", stroke: "#4f8ef7" },
  test: { fill: "#1a1a35", textColor: "#a0b4e8", stroke: "#2e3f6e" },
  decision: { fill: "#1f3a2a", textColor: "#6ee89e", stroke: "#3a7a52" },
};

export default function PreModellingTree() {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [collapsed, setCollapsed] = useState({});


  useEffect(() => { renderTree(); }, [collapsed]);

  function toggleNode(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function renderTree() {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const width = container.clientWidth || 1200;
    const height = 720;

    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.15, 2])
      .on("zoom", e => g.attr("transform", e.transform));
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(width * 0.07, height / 2).scale(0.65));

    function pruneData(node, depth = 0) {
      const id = node.name + depth;
      if (collapsed[id]) return { ...node, children: undefined, _id: id, _hasChildren: true };
      return {
        ...node, _id: id,
        _hasChildren: !!(node.children?.length),
        children: node.children?.map(c => pruneData(c, depth + 1))
      };
    }

    const root = d3.hierarchy(pruneData(treeData));
    d3.tree().nodeSize([52, 260])(root);

    // Links
    g.selectAll(".link").data(root.links()).enter().append("path")
      .attr("fill", "none").attr("stroke", "#2e3f6e")
      .attr("stroke-width", 1.5).attr("stroke-opacity", 0.7)
      .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

    // Defs (glow)
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Nodes
    const nodes = g.selectAll(".node").data(root.descendants()).enter()
      .append("g").attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (e, d) => {
        e.stopPropagation();
        if (d.data.note) {
          // Open detail panel
          setTooltip(prev =>
            prev?.node?._id === d.data._id ? null : { node: d.data }
          );
        }
        // Also toggle collapse if it has children
        if (d.data._hasChildren || d.data.children) {
          toggleNode(d.data._id);
        }
      });

    nodes.each(function (d) {
      const node = d3.select(this);
      const style = TYPE_STYLES[d.data.type] || TYPE_STYLES.test;
      const isCollapsed = collapsed[d.data._id];
      const label = d.data.subtitle ? `${d.data.name}: ${d.data.subtitle}` : d.data.name;
      const words = label.split(" ");
      const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
      const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
      const multiLine = label.length > 18;
      const rectW = d.data.type === "root" ? 200 : d.data.type === "checkpoint" ? 190 : 175;
      const rectH = multiLine ? 44 : 34;

      node.append("rect")
        .attr("x", -rectW / 2).attr("y", -rectH / 2)
        .attr("width", rectW).attr("height", rectH).attr("rx", 5)
        .attr("fill", style.fill).attr("stroke", style.stroke)
        .attr("stroke-width", d.data.type === "checkpoint" ? 2 : 1)
        .attr("filter", ["checkpoint", "root"].includes(d.data.type) ? "url(#glow)" : null);

      const textAttrs = {
        "text-anchor": "middle",
        fill: style.textColor,
        "font-size": d.data.type === "root" ? "12px" : "10.5px",
        "font-weight": ["root", "checkpoint"].includes(d.data.type) ? "700" : "400",
        "font-family": "'DM Mono', 'Courier New', monospace"
      };

      const applyTextAttrs = (sel, extra) => {
        let s = sel;
        const all = { ...textAttrs, ...extra };
        Object.entries(all).forEach(([k, v]) => { s = s.attr(k, v); });
        return s;
      };

      if (multiLine) {
        applyTextAttrs(node.append("text"), { y: -7 }).text(line1);
        applyTextAttrs(node.append("text"), { y: 9 }).text(line2);
      } else {
        applyTextAttrs(node.append("text"), { y: 1, "dominant-baseline": "middle" }).text(label);
      }

      if (d.data._hasChildren && isCollapsed) {
        node.append("circle").attr("cx", rectW / 2 - 6).attr("cy", 0).attr("r", 5).attr("fill", "#e2c97e");
        node.append("text")
          .attr("x", rectW / 2 - 6).attr("y", 1)
          .attr("dominant-baseline", "middle").attr("text-anchor", "middle")
          .attr("fill", "#1a1a2e").attr("font-size", "8px").attr("font-weight", "700")
          .text("+");
      }

      if (d.data.note) {
        node.append("circle")
          .attr("cx", rectW / 2 - 5).attr("cy", -rectH / 2 + 5).attr("r", 3)
          .attr("fill", d.data.type === "decision" ? "#6ee89e" : "#4f8ef7")
          .attr("opacity", 0.8);
      }
    });
  }

  return (
    <div style={{ background: "#0d0d1f", minHeight: "100vh", fontFamily: "'DM Mono','Courier New',monospace", color: "#c8d6f8", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid #1e2d52", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4f8ef7", letterSpacing: "3px", marginBottom: "3px" }}>STATISTICAL FRAMEWORK</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#e2c97e" }}>Pre-Modelling Decision Tree</div>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "10px", color: "#5a6a8a", alignItems: "center" }}>
          {[
            { color: "#e2c97e", label: "Root", bg: "#e2c97e" },
            { color: "#4f8ef7", label: "Checkpoint", bg: "#4f8ef7" },
            { color: "#4f8ef7", label: "Category", bg: "#2a2a4a" },
            { color: "#2e3f6e", label: "Test", bg: "#1a1a35" },
            { color: "#3a7a52", label: "Decision", bg: "#1f3a2a" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "2px", background: item.bg, border: `1.5px solid ${item.color}` }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "6px 24px", fontSize: "10px", color: "#3a4a6a", borderBottom: "1px solid #111128", flexShrink: 0 }}>
        Click nodes with a <span style={{ color: "#4f8ef7" }}>●</span> dot to open the detail panel · Click again to collapse branches · Scroll/drag to navigate
      </div>

      {/* Body: tree + panel side by side */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Tree area */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%", minHeight: "680px", display: "block" }} />
        </div>

        {/* Detail Panel */}
        {tooltip?.node?.note && (
          <div style={{
            width: "480px",
            flexShrink: 0,
            borderLeft: "1px solid #1e2d52",
            background: "linear-gradient(180deg, #0f0f26 0%, #0b0b1e 100%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Panel header */}
            <div style={{
              padding: "14px 18px 12px",
              borderBottom: "1px solid #1e2d52",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: "8px", color: "#4f8ef7", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                  {tooltip.node.type?.toUpperCase()}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#e2c97e", lineHeight: 1.3 }}>
                  {tooltip.node.subtitle
                    ? `${tooltip.node.name}: ${tooltip.node.subtitle}`
                    : tooltip.node.name}
                </div>
              </div>
              <button
                onClick={() => setTooltip(null)}
                style={{
                  background: "transparent", border: "1px solid #2a3a5a",
                  color: "#5a6a8a", cursor: "pointer", borderRadius: "4px",
                  padding: "3px 8px", fontSize: "11px", fontFamily: "inherit",
                  marginLeft: "10px", flexShrink: 0,
                }}
              >✕</button>
            </div>

            {/* Scrollable content — all three sections stacked */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 24px" }}>

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase",
                  color: "#4f8ef7", fontWeight: "700", marginBottom: "8px",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#4f8ef7" }} />
                  Description
                </div>
                <div style={{
                  fontSize: "12.5px", color: "#d0dcf8", lineHeight: "1.9",
                  background: "#0d0d22", border: "1px solid #1a2a48",
                  borderRadius: "6px", padding: "12px 14px",
                }}>
                  {tooltip.node.note.desc}
                </div>
              </div>

              {/* Math */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase",
                  color: "#e2c97e", fontWeight: "700", marginBottom: "8px",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#e2c97e" }} />
                  Mathematics
                </div>
                <pre style={{
                  fontSize: "11.5px", color: "#e2c97e", lineHeight: "1.85",
                  background: "#090916", border: "1px solid #2a2a3a",
                  borderRadius: "6px", padding: "12px 14px",
                  margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit",
                }}>
                  {tooltip.node.note.math}
                </pre>
              </div>

              {/* Python */}
              <div>
                <div style={{
                  fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase",
                  color: "#7ee8a2", fontWeight: "700", marginBottom: "8px",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#7ee8a2" }} />
                  Python Code
                </div>
                <pre style={{
                  fontSize: "11px", color: "#7ee8a2", lineHeight: "1.75",
                  background: "#06100a", border: "1px solid #1a3a2a",
                  borderRadius: "6px", padding: "12px 14px",
                  margin: 0, whiteSpace: "pre", fontFamily: "inherit",
                  overflowX: "auto",
                }}>
                  {tooltip.node.note.code}
                </pre>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 24px", borderTop: "1px solid #111128", fontSize: "10px", color: "#2a3a5a", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <span>4 Checkpoints · 13 Categories · 30+ Tests & Decisions</span>
        <span style={{ color: "#4f8ef7", opacity: 0.5 }}>click ● nodes to open detail panel →</span>
      </div>
    </div>
  );
}
