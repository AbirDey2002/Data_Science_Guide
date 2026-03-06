'use client';
import { useEffect } from 'react';

function renderMath() {
    if (typeof window === 'undefined') return;
    // @ts-ignore
    if (window.renderMathInElement) {
        // @ts-ignore
        window.renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    } else {
        setTimeout(renderMath, 100);
    }
}

export default function NumpyPandasPage() {
    useEffect(() => {
        // @ts-ignore
        if (window.hljs) window.hljs.highlightAll();
        renderMath();
    }, []);

    return (
        <>
            {/* ── Hero ── */}
            <div className="hero">
                <div className="hero-label">Study Guide — Session Notes</div>
                <h1>NumPy &amp; Pandas for Data Analysis</h1>
                <p>A complete reference from arrays and DataFrames through statistical testing, built from a guided learning session.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">NumPy</span>
                    <span className="badge badge-blue">Pandas</span>
                    <span className="badge badge-green">SciPy</span>
                    <span className="badge badge-green">StatsModels</span>
                    <span className="badge badge-yellow">Statistics</span>
                    <span className="badge badge-gray">Python</span>
                </div>
            </div>

            {/* ══════════════════════ FOUNDATIONS ══════════════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Foundations</h3>

            {/* Why */}
            <section className="card" id="why">
                <h2 className="card-title">Why NumPy &amp; Pandas?</h2>
                <p className="card-subtitle">NumPy is the foundational core mathematical library driving all high-performance numerical computing in Python. Radically replacing standard Python lists—which are dynamically typed, stored haphazardly across memory with massive object overhead, and catastrophically slow for math—NumPy explicitly solves this by providing a C-compiled, statically typed n-dimensional array logically stored in dense contiguous memory blocks. It fundamentally serves as the underpinning engine of Pandas, Scikit-Learn, and all Deep Learning tensors.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: any numerical computation</span>
                    <span className="badge badge-blue">When: tabular / real-world data</span>
                </div>
                <h3>Core Distinction</h3>
                <ul>
                    <li><strong>NumPy</strong> — a fast, typed array for math and matrix operations</li>
                    <li><strong>Pandas</strong> — a smart spreadsheet powered by NumPy underneath</li>
                </ul>
                <h3>Environment Setup</h3>
                <pre><code className="language-bash">{`pip install numpy pandas jupyter scipy statsmodels
jupyter notebook`}</code></pre>
            </section>

            {/* NumPy Arrays */}
            <section className="card" id="numpy-arrays">
                <h2 className="card-title">NumPy Import &amp; ndarray</h2>
                <p className="card-subtitle">An ndarray is the core homogeneous data structure natively powering NumPy. Entirely replacing incredibly slow nested Python lists, it explicitly solves the extreme bottleneck of multi-dimensional indexing and looping by structurally storing elements of a single fixed <code>dtype</code> strictly adjacent to each other in RAM (contiguous memory), allowing CPU caching to operate at peak optimal efficiency. It is the absolute standard requirement for structurally storing dense matrices, image tensors, or large generic numerical datasets.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: numeric arrays, matrices</span>
                    <span className="badge badge-green">How: np.array([...])</span>
                </div>
                <h3>Key Attributes</h3>
                <ul>
                    <li><code>.dtype</code> — the type of every element (e.g. int64, float64)</li>
                    <li><code>.shape</code> — tuple of dimensions, e.g. (5,) or (2, 3)</li>
                    <li><code>.ndim</code> — number of dimensions</li>
                </ul>
                <pre><code className="language-python">{`import numpy as np                              # Essential numerical computing library

a = np.array([1, 2, 3, 4, 5])                   # Create a 1D vector locked to continuous C-memory
print(a.dtype)                                  # 'int64' - Every single item is strictly a 64-bit integer
print(a.shape)                                  # '(5,)' - One dimensional array with 5 total elements

m = np.array([[1,2,3],[4,5,6]])                 # Create a 2D matrix (list of lists)
print(m.shape)                                  # '(2, 3)' - Matrix geometry is 2 rows by 3 columns`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Shape mismatches are the #1 source of NumPy errors. Always print <code>.shape</code> when debugging.</p>
                </div>
            </section>

            {/* Vectorized Ops */}
            <section className="card" id="vectorized">
                <h2 className="card-title">Vectorized Operations</h2>
                <p className="card-subtitle">Vectorization is the rigorous mathematical paradigm of applying singular operations uniformly across entire arrays simultaneously instead of relying on explicit iteration. Discarding standard Python <code>for</code> loops entirely, it forcefully solves the extreme interpreter overhead logically incurred by evaluating arbitrary types iteratively on every single loop cycle. It achieves this by mathematically delegating the entire iterative loop down into highly optimized pre-compiled native C code, making it the mandatory requirement when performing arithmetic or filtering across datasets.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: math on arrays</span>
                    <span className="badge badge-blue">When: replacing loops</span>
                </div>
                <h3>Operations</h3>
                <pre><code className="language-python">{`a = np.array([1, 2, 3, 4, 5])                   # Initialize baseline fast-array

a * 2                                           # Scalar Broadcaset: C-loop multiplies every item by 2 instantly
a ** 2                                          # Element-wise power: Squares every item independently
np.sqrt(a)                                      # Vectorized math: Applies square root function across whole array

b = np.array([10, 20, 30, 40, 50])              # Initialize second array of exact same shape
a + b                                           # Element-wise add: Lines up arrays index-to-index and adds them`}</code></pre>
                <h3>Indexing &amp; Boolean Filtering</h3>
                <pre><code className="language-python">{`a = np.array([10, 20, 30, 40, 50])              # 1D Array

# Slicing
a[1:4]                                          # Slices from index 1 up to (but excluding) index 4: [20 30 40]

# 2D indexing
m = np.array([[1,2,3],[4,5,6],[7,8,9]])         # 3x3 Grid
m[0, :]                                         # Row 0, All Columns (The entire first row)
m[:, 1]                                         # All Rows, Column 1 (The entire cross-section of the 2nd column)

# Boolean filter
a[a > 25]                                       # Mask array with [False, False, True, True, True] and extract True values`}</code></pre>
            </section>

            {/* Converting Pandas ↔ NumPy */}
            <section className="card" id="convert">
                <h2 className="card-title">Converting Between Pandas &amp; NumPy</h2>
                <p className="card-subtitle">NumPy integration seamlessly dictates the critical interoperability required explicitly between high-level Pandas dataframes and low-level mathematical engines. Rejecting the incredibly hazardous requirement of manual data extraction or format conversion, it natively solves the fundamental architectural reliance statistical libraries (like Scikit-Learn or SciPy) have strictly on raw unlabelled matrices, fundamentally achieved by accessing the underlying structural NumPy array directly via <code>df.values</code> or <code>series.to_numpy()</code> prior to modeling.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: passing data to scipy/statsmodels</span>
                </div>
                <pre><code className="language-python">{`# Best practice — Idiomatic Pandas conversion
age    = df["age"].to_numpy()                   # Directly exposes the underlying C-array powering the Series
salary = df["salary"].to_numpy()                # Essential for passing raw vectors into SciPy or Scikit-Learn

# Unpack multiple columns at once using identical loops
age, yoe, salary = [df[col].to_numpy()          # List comprehension outputs 3 arrays
                    for col in ["age", "years_exp", "salary"]] # Destructures directly into 3 variables

# With NaN removal for strict statistical solvers
age = df["age"].dropna().tolist()               # Temporarily drop missing values before converting to base Python list`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Don't use <code>lambda</code> with <code>=</code> assignment — lambdas only accept expressions, not statements. Use list comprehensions instead.</p>
                </div>
            </section>

            {/* ══════════════════════ PANDAS ══════════════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Pandas</h3>

            {/* DataFrames */}
            <section className="card" id="dataframes">
                <h2 className="card-title">DataFrames &amp; Series</h2>
                <p className="card-subtitle">Pandas DataFrames are high-level labeled structural data formats explicitly built entirely on top of NumPy. Fundamentally replacing raw 2D arrays or clunky Excel spreadsheets, they elegantly solve the fact that native NumPy mathematically lacks column names, row index labels, and the explicit ability to hold heterogeneous mixed data types cleanly. A DataFrame is architecturally just a dictionary of independent 1D Series objects that are all mathematically forced to explicitly share the exact same row index alignment, acting as the undisputed king of EDA and manipulation.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: structured tabular data</span>
                    <span className="badge badge-green">How: pd.DataFrame(&#123;...&#125;)</span>
                </div>
                <h3>Accessing Data</h3>
                <pre><code className="language-python">{`import pandas as pd                             # Tabular data manipulation engine

df = pd.read_csv("data.csv")                    # Ingest comma-separated data into memory DataFrame

# Inspection Tooling
df.shape                                        # Tuple explicitly defining (Total_Rows, Total_Columns)
df.head()                                       # Print top 5 rows to visualize structural parse success
df.dtypes                                       # Scan array classes (int64, float64, object/string)
df.info()                                       # Macro-summary containing null-counts and RAM usage
df.describe()                                   # Generates Min, Max, Mean, Std, and Quartiles for continuous columns

# Column access
df["salary"]                                    # Single bracket extracts 1D Pandas Series object
df[["name", "salary"]]                          # Double bracket extracts isolated 2D DataFrame slice

# Row access
df.iloc[0]                                      # Integer Location: Extract literal 1st row in memory
df.loc[df["age"] > 28]                          # Conditional Location: Extract rows passing boolean age mask`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p><code>iloc</code> = integer position (like NumPy). <code>loc</code> = label or condition. Mixing them up is a very common early mistake.</p>
                </div>
            </section>

            {/* Cleaning */}
            <section className="card" id="cleaning">
                <h2 className="card-title">Data Cleaning</h2>
                <p className="card-subtitle">Data cleaning represents the aggressive standardization and correction of brutally raw real-world data immediately post-loading. Reversing the disastrous assumption that any data is theoretically flawless out of the box, it systematically solves fatal null values crashing models, duplicated rows illegally skewing critical metrics, and profoundly incorrect internal data types actively breaking downstream logic. It executes this perfectly using highly vectorized Pandas functions like <code>.isna()</code>, <code>.fillna()</code>, and <code>pd.to_datetime()</code> globally across the set.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: before any analysis</span>
                </div>
                <h3>Missing Values</h3>
                <pre><code className="language-python">{`df.isnull().sum()                               # Converts NaNs to True/False, then sums Trues to count missingness column-by-column

df.dropna()                                     # Nukes any row containing natively a single NaN value across all columns
df.dropna(subset=["age"])                       # Nuanced drop: Only destroy row if 'age' specifically is missing

df["age"].fillna(df["age"].mean())              # Mean Imputation: Replaces age NaNs with the mathematical average age
df.fillna(method="ffill")                       # Forward-Fill: Carry last known valid observation forward (Crucial for Time Series)`}</code></pre>
                <h3>Type Fixes &amp; New Columns</h3>
                <pre><code className="language-python">{`df["age"] = df["age"].astype(int)               # Force cast column memory typing from float/object to hard integer
df["date"] = pd.to_datetime(df["date"])         # Parse strings into true DateTime objects natively

df["month"] = df["date"].dt.month               # The .dt accessor unpacks DateTime specific fragments rapidly

df["salary_monthly"] = df["salary"] / 12        # Vectorized feature generation: Creates entire new column in one command

import numpy as np
df["seniority"] = np.where(df["age"] > 30,      # Vectorized IF statement
                           "senior",            # Value if True
                           "junior")            # Value if False`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Even datasets that look clean can have hidden NaNs. Always run <code>df.isnull().sum()</code> before any statistical test — NaNs propagate silently and return <code>nan</code> results.</p>
                </div>
            </section>

            {/* GroupBy */}
            <section className="card" id="groupby">
                <h2 className="card-title">Grouping &amp; Aggregation</h2>
                <p className="card-subtitle">Groupby aggregation actively implements the Split-Apply-Combine methodology precisely required for categorical aggregation. Bypassing the agonizing process of writing complex nested loops and arbitrary dictionaries just to aggregate structural counts, it cleanly solves the urgent demand to calculate rapid descriptive statistics strictly segmented by discrete categories. It elegantly operates by splitting data natively by unique keys, dynamically vector-applying a mathematical function (mean, sum), and actively concatenating them right back into a dense informative dataframe.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: summarizing by category</span>
                    <span className="badge badge-blue">When: equivalent to SQL GROUP BY</span>
                </div>
                <pre><code className="language-python">{`# Basic pattern
df.groupby("department")["salary"].mean()       # Split DF by category, isolate target array, compute average

# Multiple aggregations
df.groupby("department")["salary"].agg(["mean","min","max","count"]) # Stack multiple statistics across the department clusters

# Group by multiple columns
df.groupby(["department","seniority"])["salary"].mean() # Creates Multi-Index output (e.g. Sales+Senior, Sales+Junior)

# Different function per column
df.groupby("department").agg({                  # Pass Dictionary routing specific mathematical functions...
    "salary": "mean",                           # ...Calculate the mean for Salary
    "age":    "max"                             # ...Find the maximum for Age
})

# Reset index after groupby
result = df.groupby("department")["salary"].mean().reset_index() # Converts GroupBy Series output back into flat 2D DataFrame`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>After groupby, the group column becomes the index. Use <code>.reset_index()</code> to get a clean flat DataFrame back.</p>
                </div>
            </section>

            {/* ══════════════════════ STATISTICS ══════════════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Statistical Testing</h3>

            {/* Stats Map */}
            <section className="card" id="stats-map">
                <h2 className="card-title">Statistical Testing — The Map</h2>
                <p className="card-subtitle">Hypothesis Testing provides the formal mathematical procedures required to definitively accept or logically reject assumptions about data. Replacing the hazardous act of casually eyeballing bar charts to assume observed differences are inherently real, it strictly solves the human bias of seeing patterns in totally random statistical noise (Apophenia). It technically executes this by calculating a rigorous test statistic based directly on sample variance, deriving a p-value to determine the strict mathematical probability of the Null Hypothesis relative to Alpha {String.raw`$(\alpha)$`}.</p>
                <h3>Hypothesis Framework</h3>
                <ul>
                    <li><strong>H₀ (Null)</strong> — nothing is going on, any difference is noise</li>
                    <li><strong>H₁ (Alternative)</strong> — something real is happening</li>
                    <li><strong>p &lt; 0.05</strong> → reject H₀ → statistically significant</li>
                    <li><strong>p ≥ 0.05</strong> → fail to reject H₀ → not enough evidence</li>
                </ul>
                <h3>Test Selection Guide</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Question</th><th>Data Type</th><th>Test</th></tr></thead>
                        <tbody>
                            <tr><td>Do 2 groups differ in mean?</td><td>Numeric</td><td>t-test</td></tr>
                            <tr><td>Do 3+ groups differ in mean?</td><td>Numeric</td><td>ANOVA</td></tr>
                            <tr><td>Are 2 variables related?</td><td>Numeric</td><td>Correlation</td></tr>
                            <tr><td>Are categories independent?</td><td>Categorical</td><td>Chi-Square</td></tr>
                            <tr><td>Non-normal data, 2 groups?</td><td>Numeric</td><td>Mann-Whitney U</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Always identify your data type before picking a test. Numeric and categorical data belong to completely different test families.</p>
                </div>
            </section>

            {/* T-Test */}
            <section className="card" id="np-ttest">
                <h2 className="card-title">The T-Test</h2>
                <p className="card-subtitle">The Student's T-Test is a fundamental statistical test explicitly designed for rigorously comparing the means of precisely two isolated groups. Definitively rejecting the assumption that raw mean differences inherently indicate significance, it solves the challenge of assessing whether an observed difference is structurally real or merely a byproduct of small sample sizes and massive in-group variance. It computationally executes this by calculating exactly how many standard errors apart the two means reside via {String.raw`$t = (\mu_1 - \mu_2) / (s / \sqrt{n})$`} using native <code>scipy.stats</code> algorithms.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: comparing 2 group means</span>
                    <span className="badge badge-blue">When: same measurement, different groups</span>
                </div>
                <h3>Formula</h3>
                <div className="math-block">
                    {String.raw`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}}$$`}
                </div>
                <h3>Three Variants</h3>
                <ul>
                    <li><code>ttest_ind</code> — two independent groups (e.g. Eng vs HR)</li>
                    <li><code>ttest_rel</code> — same group before &amp; after (paired)</li>
                    <li><code>ttest_1samp</code> — one group vs a known value</li>
                </ul>
                <pre><code className="language-python">{`from scipy import stats                         # Powerful applied mathematics library

male   = df[df["Gender"] == "Male"]["Salary"].dropna()   # Boolean mask slice for Group A
female = df[df["Gender"] == "Female"]["Salary"].dropna() # Boolean mask slice for Group B

t_stat, p_value = stats.ttest_ind(male, female)          # Independent sample parametric mean differential test
print(f"t-statistic: {t_stat:.3f}")                      # T-Score: Distance between means scaled by group variance
print(f"p-value:     {p_value:.3f}")                     # If < 0.05, the genders have statistically divergent central salaries

# Or handle NaNs inline gracefully
t_stat, p_value = stats.ttest_ind(age, salary, nan_policy="omit") # Instructs scipy engine to ignore nulls on the fly`}</code></pre>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Only compare the same type of measurement across groups (salary vs salary). Comparing incompatible scales (age vs salary) will produce a technically valid but meaningless result.</p>
                </div>
            </section>

            {/* ANOVA */}
            <section className="card" id="np-anova">
                <h2 className="card-title">ANOVA + Tukey's HSD</h2>
                <p className="card-subtitle">ANOVA (Analysis of Variance) operates as a powerful omnibus test designed natively for comparing the means of strictly three or more logical groups simultaneously. Abandoning the dangerous practice of repeatedly running multiple isolated T-Tests, it distinctly solves the compounding False Positive rate (Family-wise Error Rate) explicitly caused by such iteration. It determines significance logically by structurally comparing the aggregate variance computed <strong>between</strong> independent groups against the baseline variance contained natively <strong>within</strong> them via an F-statistic.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: 3+ group means to compare</span>
                    <span className="badge badge-blue">When: need to know which specific groups differ</span>
                </div>
                <h3>Formula</h3>
                <div className="math-block">
                    {String.raw`$$F = \frac{MS_{between}}{MS_{within}}$$`}
                </div>
                <h3>Full Pipeline</h3>
                <pre><code className="language-python">{`from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd

# Step 1: Omnibus ANOVA — is there ANY difference anywhere?
groups = [
    df[df["Education Level"] == level]["Salary"].dropna()   # Strip target column NA's to prevent calculation crashes
    for level in df["Education Level"].dropna().unique()    # Create isolated dynamic array slices per categorical group
]
f_stat, p_value = stats.f_oneway(*groups)                   # Unpack groups dynamically into parametric ANOVA F-test
print(f"ANOVA → F: {f_stat:.3f}, p: {p_value:.3f}")         # Result indicates global divergence existence

# Step 2: Only execute Tukey HSD if ANOVA is strictly significant (<0.05)
if p_value < 0.05:                                          # Strict gatekeeping prevents 'fishing' for random p-values
    tukey = pairwise_tukeyhsd(                              # Evaluates every possible pairing cleanly adjusting for Family-Wise Error Rate
        endog=df["Salary"].dropna(),                        # The numeric target array we want to measure
        groups=df["Education Level"].dropna(),              # The label array mapped 1-to-1 to the target
        alpha=0.05                                          # 95% Confidence threshold limit
    )
    print(tukey)                                            # Outputs exact pairwise combinations identifying the true source of variance
else:
    print("No significant difference — skip Tukey.")        # Mathematically terminating early saves enormous compute`}</code></pre>
                <h3>Reading the Tukey Output</h3>
                <ul>
                    <li><code>meandiff</code> — how much higher group2 is vs group1</li>
                    <li><code>p-adj</code> — p-value adjusted for multiple comparisons</li>
                    <li><code>reject=True</code> — the difference is statistically significant</li>
                    <li><code>lower/upper</code> — 95% confidence interval on the difference</li>
                </ul>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Always run ANOVA before Tukey. Running Tukey without ANOVA first is "fishing" — inflating your chance of finding a spurious result.</p>
                </div>
            </section>

            {/* Correlation */}
            <section className="card" id="correlation">
                <h2 className="card-title">Correlation (Pearson)</h2>
                <p className="card-subtitle">Pearson Correlation provides a tightly normalized metric structurally evaluating the strictly linear geometric relationship bridging two distinct continuous vectors. Evolving beyond subjective scatterplot eyeballing, it completely resolves the impossibility of identically quantifying exactly how strongly two separate numeric features logically move together without relying on raw visual interpretations. Operating strictly on a scale from -1 to 1, it explicitly measures normalized covariance, acting as a crucial prerequisite for identifying severe structural multicollinearity prior to predictive modeling.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">When: two continuous variables (e.g. age vs salary)</span>
                    <span className="badge badge-blue">When: testing linear relationship</span>
                </div>
                <h3>Formula</h3>
                <div className="math-block">
                    {String.raw`$$r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i-\bar{x})^2 \cdot \sum(y_i-\bar{y})^2}}$$`}
                </div>
                <h3>Interpreting r</h3>
                <ul>
                    <li><strong>0.7+</strong> → strong positive relationship</li>
                    <li><strong>0.3–0.7</strong> → moderate</li>
                    <li><strong>0–0.3</strong> → weak</li>
                    <li><strong>negative</strong> → as one goes up, the other goes down</li>
                </ul>
                <pre><code className="language-python">{`from scipy import stats

corr, p_value = stats.pearsonr(                     # Assumes continuous, linearly-related, homoscedastic inputs
    df["Age"].dropna(),                             # X-Vector strictly aligned without nulls
    df["Salary"].dropna()                           # Y-Vector strictly aligned without nulls
)
print(f"Correlation: {corr:.3f}")                   # r scales between -1 and +1 describing linear covariance strength
print(f"P-value:     {p_value:.3f}")                # Probability that a correlation this strong appeared by sheer accident

# Using Pandas directly for a full multi-dimensional correlation matrix
df[["Age", "Years of Experience", "Salary"]].corr() # Generates N x N grid crossing every variable against itself`}</code></pre>
            </section>

            {/* ══════════════════════ REFERENCE ══════════════════════ */}
            <h3 style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--color-border)' }}>Reference</h3>

            {/* Concept Table */}
            <section className="card" id="concept-table">
                <h2 className="card-title">All Concepts at a Glance</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Concept</th><th>When to Use</th><th>Key Function</th><th>Watch Out For</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>np.array</strong></td><td>Typed numeric arrays, fast math</td><td><code>np.array([...])</code></td><td>Shape mismatches</td></tr>
                            <tr><td><strong>Vectorization</strong></td><td>Replacing loops with array ops</td><td><code>a * 2</code>, <code>a[a &gt; 25]</code></td><td>Broadcasting rules</td></tr>
                            <tr><td><strong>pd.DataFrame</strong></td><td>Tabular real-world data</td><td><code>pd.read_csv()</code></td><td>Column name whitespace</td></tr>
                            <tr><td><strong>iloc / loc</strong></td><td>Row access</td><td><code>df.iloc[0]</code>, <code>df.loc[cond]</code></td><td>Mixing up the two</td></tr>
                            <tr><td><strong>isnull / dropna / fillna</strong></td><td>Handling missing values</td><td><code>df.isnull().sum()</code></td><td>NaNs propagate silently</td></tr>
                            <tr><td><strong>groupby + agg</strong></td><td>Summarize by category</td><td><code>df.groupby(...).mean()</code></td><td>Index after groupby</td></tr>
                            <tr><td><strong>T-Test</strong></td><td>2 group means, same measurement</td><td><code>stats.ttest_ind()</code></td><td>Don't compare different units</td></tr>
                            <tr><td><strong>ANOVA</strong></td><td>3+ group means</td><td><code>stats.f_oneway()</code></td><td>Tells you something differs, not what</td></tr>
                            <tr><td><strong>Tukey HSD</strong></td><td>Which specific groups differ (post-ANOVA)</td><td><code>pairwise_tukeyhsd()</code></td><td>Only run after significant ANOVA</td></tr>
                            <tr><td><strong>Pearson Correlation</strong></td><td>Linear relationship between 2 numeric vars</td><td><code>stats.pearsonr()</code></td><td>Not a t-test substitute</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Formula Sheet */}
            <section className="card" id="formula-sheet">
                <h2 className="card-title">Formula Reference Sheet</h2>

                <h3>T-Statistic (Independent Samples)</h3>
                <div className="math-block">
                    {String.raw`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}}$$`}
                </div>
                <p><strong>Used when:</strong> comparing means of exactly two independent groups</p>

                <h3>Sample Variance</h3>
                <div className="math-block">
                    {String.raw`$$s^2 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})^2}{n - 1}$$`}
                </div>
                <p><strong>Used when:</strong> computing spread within a group for t-test or ANOVA</p>

                <h3>F-Statistic (ANOVA)</h3>
                <div className="math-block">
                    {String.raw`$$F = \frac{\text{Variance Between Groups}}{\text{Variance Within Groups}}$$`}
                </div>
                <p><strong>Used when:</strong> comparing 3 or more group means simultaneously</p>

                <h3>Pearson Correlation Coefficient</h3>
                <div className="math-block">
                    {String.raw`$$r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i-\bar{x})^2 \cdot \sum(y_i-\bar{y})^2}}$$`}
                </div>
                <p><strong>Range:</strong> r ∈ [−1, 1], where 1 = perfect positive, −1 = perfect negative, 0 = no linear relation</p>
            </section>

            {/* Code Appendix */}
            <section className="card" id="code-appendix">
                <h2 className="card-title">Code Reference</h2>

                <h3>NumPy — Array Creation &amp; Operations</h3>
                <pre><code className="language-python">{`import numpy as np                              # Core initialization

a = np.array([1, 2, 3, 4, 5])                   # 1D Vector structure
m = np.array([[1,2,3],[4,5,6]])                 # 2D Matrix structure

# Vectorized math
a * 2;  a ** 2;  np.sqrt(a)                     # High-speed parallel scalar/functional transforms

# Indexing
a[1:4];  m[0, :];  m[:, 1];  m[1, 2]            # Slice components via memory offset indexing

# Boolean filter
a[a > 25]                                       # High speed true/false logic gate filtering`}</code></pre>

                <h3>Pandas — Load &amp; Inspect</h3>
                <pre><code className="language-python">{`import pandas as pd                             # Core initialization

df = pd.read_csv("data.csv")                    # Ingest file format into DataFrame
df.shape;  df.head();  df.dtypes                # Fundamental structure scans
df.info();  df.describe()                       # Summary macros covering mem and math
df.isnull().sum()                               # Tallying missingness horizontally`}</code></pre>

                <h3>Pandas — Clean Data</h3>
                <pre><code className="language-python">{`df.dropna()                                     # Blind vertical erasure for null inclusion
df["age"].fillna(df["age"].mean())              # Standard arithmetic mean replacement
df["age"] = df["age"].astype(int)               # Strong memory type casting
df["date"] = pd.to_datetime(df["date"])         # Strong date type casting sequence
df.drop_duplicates(inplace=True)                # Destructive inline duplicated row deletion
df.rename(columns={"old": "new"}, inplace=True) # Destructive inline dictionary column remap
df["new_col"] = np.where(df["age"] > 30, "senior", "junior") # Vectorized feature branching`}</code></pre>

                <h3>Pandas — GroupBy &amp; Aggregation</h3>
                <pre><code className="language-python">{`df.groupby("department")["salary"].mean()       # Base 1x1 summary map
df.groupby("department")["salary"].agg(["mean","min","max"]) # Base 1x3 combined mathematical summary map
df.groupby(["dept","seniority"])["salary"].mean() # Multi-index hierarchical branch mapping
df.groupby("department").agg({"salary":"mean","age":"max"})  # Dict-based mapped isolated calculations
df.groupby("department")["salary"].mean().reset_index()      # Mandatory flattening algorithm returning DataFrame`}</code></pre>

                <h3>T-Test (Independent Samples)</h3>
                <pre><code className="language-python">{`from scipy import stats                         # SciPy core

male   = df[df["Gender"] == "Male"]["Salary"].dropna()   # Boolean mask branch A
female = df[df["Gender"] == "Female"]["Salary"].dropna() # Boolean mask branch B

t_stat, p_value = stats.ttest_ind(male, female) # Standard mean distance comparison computation 
print(f"t-stat: {t_stat:.3f},  p: {p_value:.3f}")

# Handle NaNs inline instead 
t_stat, p_value = stats.ttest_ind(a, b, nan_policy="omit") # Automatic omission pipeline`}</code></pre>

                <h3>ANOVA + Tukey HSD</h3>
                <pre><code className="language-python">{`from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd

groups = [                                      # Compression algorithm grabbing categorical arrays
    df[df["Education Level"] == level]["Salary"].dropna()
    for level in df["Education Level"].dropna().unique()
]
f_stat, p_value = stats.f_oneway(*groups)       # Run umbrella deviation detector
print(f"F: {f_stat:.3f},  p: {p_value:.3f}")

if p_value < 0.05:                              # Conditional execution protecting structural FWER rules
    tukey = pairwise_tukeyhsd(                  # Pairwise variance matrix executor
        endog=df["Salary"].dropna(),
        groups=df["Education Level"].dropna(),
        alpha=0.05
    )
    print(tukey)`}</code></pre>

                <h3>Pearson Correlation</h3>
                <pre><code className="language-python">{`from scipy import stats

corr, p_value = stats.pearsonr(                     # Linear geometric shape detector
    df["Age"].dropna(),
    df["Salary"].dropna()
)
print(f"r = {corr:.3f},  p = {p_value:.3f}")        # Display 1D covariance scaling factor

# DataFrame wide matrix execution mapping natively
df[["Age", "Years of Experience", "Salary"]].corr()`}</code></pre>
            </section>
        </>
    );
}
