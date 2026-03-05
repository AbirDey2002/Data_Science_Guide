'use client';
import { useEffect } from 'react';
import PreModellingTree from '@/components/PreModellingTree';

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
  } else { setTimeout(renderMath, 100); }
}

export default function PreModellingPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.hljs) window.hljs.highlightAll();
      renderMath();
    }
  }, []);

  return (
    <>



      <div className="hero" id="top">
        <div className="hero-label">Study Guide — Data Science</div>
        <h1>Pre-Modelling</h1>
        <div className="hero-meta">A complete framework for validating data before training any model</div>
        <div className="badge-row">
          <span className="badge badge-blue">Statistics</span>
          <span className="badge badge-gold">4 Checkpoints</span>
          <span className="badge badge-green">13 Categories</span>
          <span className="badge badge-amber">30+ Tests</span>
          <span className="badge badge-red">Python Code</span>
        </div>
      </div>


      <section id="intro">
        <div className="topic-card">
          <h2 className="section-title">What is Pre-Modelling?</h2>
          <p className="intro-text">Pre-modelling is the systematic process of interrogating your data <strong>before training any model</strong>. Think of it as the soil check before laying a building's foundations — you wouldn't start laying bricks without verifying the ground is stable.</p>
          <p>It answers three fundamental questions:</p>
          <div className="tag-row">
            <span className="tag tag-when">Is my data healthy enough to model?</span>
            <span className="tag tag-when">Do my variables carry useful signal?</span>
            <span className="tag tag-when">Am I violating my model's assumptions?</span>
          </div>

          <h3>Why it matters</h3>
          <p>Models are blind optimists — they will find patterns whether or not they exist. Skipping pre-modelling leads to:</p>
          <div className="gotcha"><strong>Overfitting</strong> — model memorises noise instead of signal</div>
          <div className="gotcha"><strong>Multicollinearity</strong> — variables silently cancelling each other out</div>
          <div className="gotcha"><strong>Biased coefficients</strong> — model lying confidently</div>
          <div className="gotcha"><strong>Wasted compute</strong> — training on zero-signal variables</div>

          <h3>EDA vs Pre-Modelling</h3>
          <table>
            <thead><tr><th>EDA</th><th>Pre-Modelling</th></tr></thead>
            <tbody>
              <tr><td>Visual and descriptive</td><td>Statistical and prescriptive</td></tr>
              <tr><td>Asks "what do I see?"</td><td>Asks "what does this mean for my model?"</td></tr>
              <tr><td>Observation</td><td>Decision-making</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ margin: "40px -48px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#0d0d1f" }}>
        <PreModellingTree />
      </div>




      <section id="pipeline">
        <div className="topic-card">
          <h2 className="section-title">Where Pre-Modelling Fits</h2>
          <p className="intro-text">Pre-modelling sits <strong>after data cleaning</strong> and <strong>before feature engineering</strong>. It's the bridge between "I have data" and "I'm ready to model."</p>
          <table>
            <thead><tr><th>Stage</th><th>What You're Doing</th></tr></thead>
            <tbody>
              <tr><td>Data Collection</td><td>Gathering raw data</td></tr>
              <tr><td>Data Cleaning</td><td>Fixing nulls, types, duplicates</td></tr>
              <tr><td style={{ color: 'var(--gold)', fontWeight: '700' }}>Pre-Modelling ★</td><td style={{ color: 'var(--gold)' }}>Understanding, testing, validating your data</td></tr>
              <tr><td>Feature Engineering</td><td>Creating/transforming variables</td></tr>
              <tr><td>Modelling</td><td>Training your algorithm</td></tr>
              <tr><td>Evaluation</td><td>Measuring performance</td></tr>
            </tbody>
          </table>
        </div>
      </section>




      <div id="cp1" className="checkpoint-header">
        <div className="cp-num">Checkpoint 1</div>
        <h2>Variable Relevance</h2>
        <p>Does each variable deserve a seat at the table? Test choice depends on the type pairing between predictor and target.</p>
      </div>


      <section id="cont-cont">
        <div className="topic-card">
          <h2 className="section-title">Continuous vs Continuous</h2>
          <p className="intro-text">When both predictor and target are continuous, you measure how strongly and consistently they move together. Always pair visual checks (scatter plots) with statistical tests.</p>


          <div id="pearson">
            <h3>Pearson Correlation</h3>
            <div className="tag-row">
              <span className="tag tag-when">When: both variables are roughly normal</span>
              <span className="tag tag-when">When: relationship is expected to be linear</span>
              <span className="tag tag-warn">Sensitive to outliers</span>
            </div>
            <p>Measures the strength and direction of a <strong>linear</strong> relationship. Output r ranges from -1 to +1.</p>
            <div className="formula-block">
              {String.raw`$$r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i-\bar{x})^2 \cdot \sum(y_i-\bar{y})^2}}$$`}
              <p className="formula-label">{'$r$'} = correlation coefficient · {'$x_i, y_i$'} = individual observations · {String.raw`$\bar{x}, \bar{y}$`} = sample means. |r| &lt; 0.1 = negligible · 0.1–0.3 = weak · 0.3–0.5 = moderate · &gt;0.5 = strong</p>
            </div>
            <pre><code className="language-python">{`from scipy.stats import pearsonr                    # Linear correlation function

for col in num_cols:                                # Iterate through all numeric features
    if col != target:                               # Don't correlate target with itself
        r, p = pearsonr(df[col].dropna(),           # Calculate correlation r and p-value
                        df[target].dropna())        # Must drop NA pairs for pearsonr to work
        print(f"{col}: r={r:.3f}, p={p:.4f}")       # r near 0 = weak, r near 1 or -1 = strong`}</code></pre>
          </div>


          <div id="spearman">
            <h3>Spearman Correlation</h3>
            <div className="tag-row">
              <span className="tag tag-when">When: data is skewed or has outliers</span>
              <span className="tag tag-when">When: relationship is monotonic but possibly curved</span>
            </div>
            <p>Non-parametric. Computes Pearson on the <strong>ranks</strong> rather than raw values — robust to outliers and non-normal distributions.</p>
            <div className="formula-block">
              {String.raw`$$\rho = 1 - \frac{6\sum d_i^2}{n(n^2-1)}$$`}
              <p className="formula-label">{String.raw`$\rho$`} = Spearman correlation · {String.raw`$d_i = \text{rank}(x_i) - \text{rank}(y_i)$`} = rank difference · {'$n$'} = sample size. If Spearman &gt;&gt; Pearson → relationship is curved.</p>
            </div>
            <pre><code className="language-python">{`from scipy.stats import spearmanr, pearsonr         # Both rank-based and linear correlation

for col in num_cols:                                # Iterate through numerical features
    if col != target:                               # Exclude target variable
        rho, _ = spearmanr(df[col].dropna(),        # Calculate Spearman (robust to outliers/curve)
                           df[target].dropna())
        r,   _ = pearsonr(df[col].dropna(),         # Calculate Pearson (strict linear assumption)
                          df[target].dropna())
        diff = abs(rho) - abs(r)                    # Large difference hints at non-linear monotonic trend
        flag = "⚠ CURVED" if diff > 0.1 else ""     # Flag conditionally for visual review
        print(f"{col}: Spearman={rho:.3f}, Pearson={r:.3f} {flag}")`}</code></pre>
          </div>


          <div id="vif">
            <h3>VIF — Variance Inflation Factor</h3>
            <div className="tag-row">
              <span className="tag tag-when">When: checking for multicollinearity between predictors</span>
              <span className="tag tag-warn">Always run — even when correlation matrix looks clean</span>
            </div>
            <p>Measures how well each predictor can be explained by ALL other predictors. Catches group collinearity that pairwise correlations miss.</p>
            <div className="formula-block">
              {String.raw`$$\text{VIF}_j = \frac{1}{1 - R^2_j}$$`}
              <p className="formula-label">{'$R^2_j$'} = R-squared from regressing variable {'$j$'} on all other predictors. VIF=1 → no collinearity · 1–5 → acceptable · 5–10 → investigate · &gt;10 → action required.</p>
            </div>
            <pre><code className="language-python">{`from statsmodels.stats.outliers_influence import variance_inflation_factor # VIF calculation
import statsmodels.api as sm                        # Core statistics API

X = sm.add_constant(df[num_cols].dropna())          # OLS requires an explicit intercept column consisting of 1s
vif = pd.DataFrame({                                # Bundle results efficiently into a dataframe
    "feature": X.columns,                           # Record column name
    "VIF": [variance_inflation_factor(X.values, i)  # Calculate VIF score for every column index
             for i in range(X.shape[1])]
}).iloc[1:]                                         # Slice off the intercept (index 0) since its VIF is meaningless
print(vif.sort_values("VIF", ascending=False))      # Sort highest internal correlation to the top`}</code></pre>
          </div>
        </div>
      </section>


      <section id="multicollinearity">
        <div className="topic-card">
          <h2 className="section-title">The Multicollinearity Problem</h2>
          <p className="intro-text">When two or more input variables are highly correlated with <strong>each other</strong>, the model can't tell which one deserves credit for explaining the target.</p>
          <p>Consequences: unstable coefficients (swing wildly on small data changes), inflated standard errors, wrong variable importance. Your model may predict well but explain nothing correctly.</p>

          <div className="gotcha"><strong>Key trap:</strong> The correlation matrix only catches pairwise collinearity. VIF catches group collinearity — three or four variables that are collectively linear combinations of each other, even when no single pair exceeds 0.8.</div>

          <div className="decision-block">
            <div className="d-title">When VIF &gt; 10 — your options</div>
            <ul>
              <li><strong>Drop one</strong> — keep whichever correlates more strongly with the target</li>
              <li><strong>Combine them</strong> — ratio, average, or PCA component</li>
              <li><strong>Ridge Regression</strong> — adds $\lambda||\beta||^2$ penalty, naturally handles collinearity</li>
            </ul>
          </div>
        </div>
      </section>


      <section id="cat-cont">
        <div className="topic-card">
          <h2 className="section-title">Categorical vs Continuous</h2>
          <p className="intro-text">Does the value of a categorical variable shift the distribution of a continuous target? If all groups produce similar distributions, the variable adds nothing.</p>

          <div id="anova">
            <h3>t-test / ANOVA</h3>
            <div className="tag-row">
              <span className="tag tag-when">t-test: exactly 2 groups</span>
              <span className="tag tag-when">ANOVA: 3+ groups</span>
              <span className="tag tag-warn">Requires approximate normality within groups</span>
            </div>
            <div className="formula-block">
              {String.raw`$$F = \frac{MS_{between}}{MS_{within}} = \frac{\sum n_j(\bar{y}_j - \bar{y})^2 / (k-1)}{\sum\sum(y_{ij}-\bar{y}_j)^2/(N-k)}$$`}
              <p className="formula-label">{'$F$'} = F-statistic · {'$MS$'} = mean square · {'$n_j$'} = samples in group j · {String.raw`$\bar{y}_j$`} = group mean · {String.raw`$\bar{y}$`} = grand mean · {'$k$'} = number of groups · {'$N$'} = total observations.</p>
            </div>
            <pre><code className="language-python">{`from scipy.stats import f_oneway, ttest_ind         # ANOVA (3+ groups) and T-test (2 groups)

for col in cat_cols:                                # Iterate through discrete categorical columns
    groups = [df[df[col]==g][target].dropna()       # Split the continuous target variable into separate sub-arrays per category
              for g in df[col].unique()]            # using list comprehension
    if len(groups) == 2:                            # Only two categories (e.g., Male/Female)
        stat, p = ttest_ind(*groups)                # Execute independent T-test
    else:                                           # Three or more categories (e.g., Red/Green/Blue)
        stat, p = f_oneway(*groups)                 # Execute One-Way ANOVA F-test
    print(f"{col}: stat={stat:.3f}, p={p:.4f}")     # p < 0.05 implies target means differ across groups`}</code></pre>
          </div>

          <div id="nonparam">
            <h3>Mann-Whitney U / Kruskal-Wallis</h3>
            <div className="tag-row">
              <span className="tag tag-when">When normality fails within groups</span>
              <span className="tag tag-when">When data is heavily skewed or has outliers</span>
            </div>
            <p>Work on <strong>ranks</strong> rather than raw values. More general than their parametric equivalents — test whether distributions differ, not just means.</p>
            <div className="formula-block">
              {String.raw`$$H = \frac{12}{N(N+1)}\sum\frac{n_j\bar{R}_j^2}{1} - 3(N+1) \sim \chi^2(k-1)$$`}
              <p className="formula-label">{'$H$'} = Kruskal-Wallis statistic · {String.raw`$\bar{R}_j$`} = mean rank in group {'$j$'} · {'$N$'} = total observations · {'$k$'} = number of groups.</p>
            </div>
            <pre><code className="language-python">{`from scipy.stats import mannwhitneyu, kruskal       # Non-parametric equivalent tests for skewed/non-normal targets

for col in cat_cols:                                # Iterate categorical inputs
    groups = [df[df[col]==g][target].dropna()       # Partition continuous target by category group
              for g in df[col].unique()]
    if len(groups) == 2:                            # If effectively binary
        stat, p = mannwhitneyu(*groups,             # Use rank-based Mann-Whitney U test 
                               alternative='two-sided') # Test for difference in either direction
    else:                                           # Three or more categories
        stat, p = kruskal(*groups)                  # Use rank-based Kruskal-Wallis H test
    print(f"{col}: stat={stat:.3f}, p={p:.4f}")     # p < 0.05 implies rank distributions differ`}</code></pre>
          </div>

          <div id="tukey">
            <h3>Tukey HSD (post-hoc)</h3>
            <div className="tag-row">
              <span className="tag tag-when">After ANOVA — to find WHICH groups differ</span>
            </div>
            <p>ANOVA tells you <em>that</em> a difference exists. Tukey HSD identifies <em>which</em> pairs, controlling the family-wise error rate. Use results to decide whether to <strong>collapse similar groups</strong> into one category.</p>
            <div className="formula-block">
              {String.raw`$$q^* = \frac{\bar{y}_i - \bar{y}_j}{\sqrt{MS_{within}/2 \cdot (1/n_i + 1/n_j)}}$$`}
              <p className="formula-label">{'$q^*$'} = Studentised Range statistic · {String.raw`$\bar{y}_i, \bar{y}_j$`} = group means · {'$MS_{within}$'} = within-group mean square · {'$n_i, n_j$'} = group sizes. Reject if {String.raw`$|q^*| > q_\alpha$`}.</p>
            </div>
            <pre><code className="language-python">{`from statsmodels.stats.multicomp import pairwise_tukeyhsd # Post-hoc analyzer

result = pairwise_tukeyhsd(                         # Determines *which* specific pairs of groups differ after an ANOVA
    endog=df[target].dropna(),                      # The endogenous variable (target)
    groups=df[col][df[target].notna()],             # The categorical group assignments (masking out target NaNs)
    alpha=0.05                                      # Family-wise error rate threshold (5% significance)
)
print(result.summary())                             # Prints a matrix stating 'True' or 'False' for every possible pairwise group comparison`}</code></pre>
          </div>
        </div>
      </section>


      <section id="cat-cat">
        <div className="topic-card">
          <h2 className="section-title">Categorical vs Categorical</h2>
          <p className="intro-text">Does knowing the category of one variable change the probability distribution of the other? Always pair Chi-Square (significance) with Cramér's V (effect size).</p>

          <div id="chisq">
            <h3>Chi-Square Test of Independence</h3>
            <div className="tag-row">
              <span className="tag tag-when">When: testing association between two categorical variables</span>
              <span className="tag tag-warn">Expected cell counts must all be ≥ 5</span>
            </div>
            <div className="formula-block">
              {String.raw`$$\chi^2 = \sum\frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \quad E_{ij} = \frac{R_i \cdot C_j}{N}$$`}
              <p className="formula-label">{'$O_{ij}$'} = observed count · {'$E_{ij}$'} = expected count · {'$R_i$'} = row total · {'$C_j$'} = column total · {'$N$'} = grand total · {'$df = (rows-1)(cols-1)$'}. Sensitive to large N — always pair with Cramér's V.</p>
            </div>
            <pre><code className="language-python">{`from scipy.stats import chi2_contingency            # Independence test for categorical variables

ct = pd.crosstab(df[col], df[target])               # Generate a 2D frequency count matrix (Contingency Table)
chi2, p, dof, expected = chi2_contingency(ct)       # Returns test stat, p-value, degrees of freedom, and expected flat distribution matrix
print(f"χ²={chi2:.2f}, p={p:.4f}, min_expected={expected.min():.1f}") # Min expected must be >= 5 for Chi-Square to hold validity`}</code></pre>
          </div>

          <div id="cramersv">
            <h3>Cramér's V — Effect Size</h3>
            <div className="tag-row">
              <span className="tag tag-when">Always use alongside Chi-Square</span>
              <span className="tag tag-good">Solves Chi-Square's sensitivity to large N</span>
            </div>
            <div className="formula-block">
              {String.raw`$$V = \sqrt{\frac{\chi^2}{N \cdot \min(r-1,\, c-1)}}$$`}
              <p className="formula-label">{'$V$'} = Cramér's V (effect size) · {String.raw`$\chi^2$`} = chi-square statistic · {'$N$'} = total observations · {'$r, c$'} = rows, columns. Ranges 0–1. 0–0.1 = negligible · 0.1–0.3 = weak · 0.3–0.5 = moderate · &gt;0.5 = strong.</p>
            </div>
            <pre><code className="language-python">{`def cramers_v(x, y):                                # Effect size calculation for Chi-Square tests
    ct = pd.crosstab(x, y)                          # Regenerate contingency table
    chi2, _, _, _ = chi2_contingency(ct)            # Extract only the chi-square statistic
    n = ct.sum().sum()                              # Sum total number of observations N
    r, c = ct.shape                                 # Extract matrix dimensions (rows and columns)
    return np.sqrt(chi2 / (n * (min(r, c) - 1)))    # Normalise statistic by N and degrees of constraint to yield [0, 1] range

print(cramers_v(df[col], df[target]))               # Small values (<0.1) mean the association exists but is practically useless`}</code></pre>
          </div>

          <div id="fisher">
            <h3>Fisher's Exact Test</h3>
            <div className="tag-row">
              <span className="tag tag-when">When any expected cell count &lt; 5</span>
              <span className="tag tag-when">Best for 2×2 tables</span>
            </div>
            <p>Calculates the exact probability — doesn't rely on chi-squared approximation. Use when Chi-Square assumptions are violated.</p>
            <pre><code className="language-python">from scipy.stats import fisher_exact

              if ct.shape == (2, 2) and expected.min() &lt; 5:
              odds, p = fisher_exact(ct)
              print(f"Fisher p=&#123;p:.4f&#125;, OR=&#123;odds:.3f&#125;")</code></pre>
          </div>

          <div className="decision-block">
            <div className="d-title">Decision matrix</div>
            <ul>
              <li><strong>Keep</strong> if Chi-Square significant AND Cramér's V &gt; 0.1</li>
              <li><strong>Drop</strong> if not significant</li>
              <li><strong>Watch for quasi-separation</strong> — one category almost perfectly predicts a target class → coefficients blow up in logistic regression</li>
              <li><strong>Merge sparse categories</strong> with &lt; 30 observations into similar groups</li>
            </ul>
          </div>
        </div>
      </section>




      <div id="cp2" className="checkpoint-header">
        <div className="cp-num">Checkpoint 2</div>
        <h2>Distribution &amp; Assumptions</h2>
        <p>Every model carries hidden assumptions. Violating them doesn't crash the model — it makes it quietly wrong with full confidence. Understand your data's behaviour first, then choose a model that suits it.</p>
      </div>


      <section id="normality">
        <div className="topic-card">
          <h2 className="section-title">Normality Testing</h2>
          <p className="intro-text">Checks whether a variable follows a Gaussian distribution. Critical nuance: <strong>linear regression requires residual normality, not input normality</strong>. Testing inputs here is early warning for likely residual problems downstream.</p>
          <p>Always use visual + statistical together. Visuals tell you the shape; statistical tests tell you if it's detectable.</p>

          <h3>Visual Checks First</h3>
          <table>
            <thead><tr><th>Plot</th><th>What to Look For</th></tr></thead>
            <tbody>
              <tr><td>Q-Q Plot</td><td>Points hug the diagonal line. S-curve = skewness. Both tails above line = heavy tails. Both below = light tails.</td></tr>
              <tr><td>Histogram</td><td>Bell shape, symmetric around mean, no multiple peaks (multimodality)</td></tr>
              <tr><td>Box Plot</td><td>Median centred, whiskers roughly equal length</td></tr>
            </tbody>
          </table>

          <h3>Statistical Tests</h3>
          <table>
            <thead><tr><th>Test</th><th>Use When</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>Shapiro-Wilk</td><td>Default choice, n &lt; 2000</td><td>Gold standard; loses power at very large n</td></tr>
              <tr><td>Jarque-Bera</td><td>Large samples or to isolate cause</td><td>Tests skewness + kurtosis separately; tells you WHY normality fails</td></tr>
              <tr><td>Anderson-Darling</td><td>Emphasising tail behaviour</td><td>More sensitive to tail deviations</td></tr>
            </tbody>
          </table>

          <div className="formula-block">
            {String.raw`$$W = \frac{\left(\sum a_i x_{(i)}\right)^2}{\sum(x_i - \bar{x})^2}, \quad JB = \frac{n}{6}\left[S^2 + \frac{K^2}{4}\right]$$`}
            <p className="formula-label">{'$W$'} (Shapiro-Wilk) close to 1 → normal · {'$a_i$'} = ordered statistic coefficients · {'$x_{(i)}$'} = order statistics. {'$JB$'} (Jarque-Bera): {'$S$'} = skewness, {'$K$'} = excess kurtosis. Both ≈ 0 for a perfect normal.</p>
          </div>

          <pre><code className="language-python">{`from scipy.stats import shapiro, jarque_bera        # Normality distribution validators

for col in num_cols:                                # Iterate numerical columns
    data = df[col].dropna()                         # Clean missing values
    sample = data.sample(min(2000, len(data)), random_state=42) # Shapiro loses validity at high N, so cap randomly at 2000
    W, p_sw = shapiro(sample)                       # Strict normal check; p < 0.05 rejects normality hypothesis
    jb, p_jb = jarque_bera(data)                    # Specifically zeroes in on excessive skew and thick tails (kurtosis)
    print(f"{col}: SW W={W:.4f} p={p_sw:.4f} | JB={jb:.2f} p={p_jb:.4f}")`}</code></pre>

          <div className="decision-block">
            <div className="d-title">Fix strategy</div>
            <ul>
              <li>Right skew → <code>np.log1p(x)</code> or <code>np.sqrt(x)</code></li>
              <li>Severe skew → Box-Cox: finds optimal power $\lambda$ automatically</li>
              <li>Tree-based model → normality not required, accept and move on</li>
            </ul>
          </div>
        </div>
      </section>


      <section id="homoscedasticity">
        <div className="topic-card">
          <h2 className="section-title">Homoscedasticity</h2>
          <p className="intro-text"><strong>Homo = same, scedasticity = scatter.</strong> Variance of residuals must stay constant across all predictor levels. When it fans out (heteroscedasticity), coefficients remain unbiased but standard errors become wrong — making p-values and confidence intervals unreliable.</p>

          <h3>Visual Check: Residual vs Fitted Plot</h3>
          <p>Plot residuals against fitted values. A flat horizontal band = homoscedastic. A cone/funnel = heteroscedastic. A curve = linearity problem too.</p>

          <h3>Statistical Tests</h3>
          <table>
            <thead><tr><th>Test</th><th>Use When</th><th>Mechanism</th></tr></thead>
            <tbody>
              <tr><td>Breusch-Pagan</td><td>Default choice</td><td>Regresses $e_i^2$ on predictors — significant = variance depends on X</td></tr>
              <tr><td>White's Test</td><td>Non-linear heteroscedasticity suspected</td><td>Adds squared terms and cross-products — more general but lower power</td></tr>
              <tr><td>Levene's Test</td><td>Comparing groups</td><td>Tests equality of variance across categories</td></tr>
            </tbody>
          </table>

          <div className="formula-block">
            {String.raw`$$LM = n \cdot R^2_{aux} \sim \chi^2(k)$$`}
            <p className="formula-label">{'$LM$'} = Lagrange Multiplier statistic · {'$R^2_{aux}$'} = R² from regressing {'$e_i^2$'} on predictors · {'$n$'} = sample size · {'$k$'} = number of predictors. p &lt; 0.05 → reject homoscedasticity.</p>
          </div>

          <pre><code className="language-python">{`from statsmodels.stats.diagnostic import het_breuschpagan, het_white # Variance consistency tests

model = sm.OLS(y, X).fit()                          # Fit an Ordinary Least Squares baseline to generate residuals
lm, lm_p, _, _ = het_breuschpagan(model.resid,      # Regress the squared residuals against the X variables
                                  model.model.exog) # If X strongly predicts the error magnitude, variance is NOT constant
print(f"Breusch-Pagan: LM={lm:.3f}, p={lm_p:.4f}")  # p < 0.05 implies Heteroscedasticity (warning: SEs are now wrong)

# If BP is borderline, also run White's:
lm_w, lm_p_w, _, _ = het_white(model.resid,         # White's is exactly the same, but computationally heavier
                               model.model.exog)    # It includes all squared X columns and cross-products natively
print(f"White's Test: LM={lm_w:.3f}, p={lm_p_w:.4f}")`}</code></pre>

          <div className="decision-block">
            <div className="d-title">Fix strategy</div>
            <ul>
              <li><strong>Mild</strong> → log transform the target variable</li>
              <li><strong>Moderate</strong> → Weighted Least Squares (WLS): $\min \sum w_i(y_i - \hat&#123;y&#125;_i)^2$ where $w_i = 1/\text&#123;Var&#125;(\epsilon_i)$</li>
              <li><strong>Severe</strong> → HC3 robust standard errors: keeps coefficients, corrects the SEs</li>
              <li><strong>Cannot fix</strong> → switch to tree-based models (no assumption)</li>
            </ul>
          </div>
          <div className="gotcha"><strong>Connection:</strong> normality and homoscedasticity are linked. A log transform on the target often fixes both simultaneously — always recheck both after any transformation.</div>
        </div>
      </section>


      <section id="linearity">
        <div className="topic-card">
          <h2 className="section-title">Linearity Assessment</h2>
          <p className="intro-text">The relationship between inputs and target must follow a straight line for linear models. Non-linearity won't crash your model — it produces plausible-looking but <strong>systematically wrong</strong> coefficients in a structured, predictable way.</p>

          <h3>Tests</h3>
          <table>
            <thead><tr><th>Method</th><th>What It Does</th><th>Signal</th></tr></thead>
            <tbody>
              <tr><td>LOWESS Curve</td><td>Fits a smooth curve with no shape assumptions</td><td>Curve bends or changes direction → non-linear</td></tr>
              <tr><td>Ramsey RESET Test</td><td>Adds polynomial fitted-value terms, tests if they improve fit</td><td>Significant p → linearity violated</td></tr>
              <tr><td>Pearson vs Spearman</td><td>Compare linear vs monotonic correlation</td><td>Spearman &gt;&gt; Pearson → curved but consistent</td></tr>
            </tbody>
          </table>

          <div className="formula-block">
            {String.raw`$$\text{RESET: } F\text{-test on } \hat{y}^2, \hat{y}^3 \text{ added to original model}$$`}
            <p className="formula-label">If adding polynomial terms significantly improves fit, the original linear form was misspecified.</p>
          </div>

          <pre><code className="language-python">from statsmodels.stats.diagnostic import linear_reset

            model = sm.OLS(y, X).fit()
            reset = linear_reset(model, power=3, use_f=True)
            print(f"RESET: F=&#123;reset.statistic:.3f&#125;, p=&#123;reset.pvalue:.4f&#125;")
            if reset.pvalue &lt; 0.05:
            print("⚠ Linearity violated")</code></pre>

          <div className="decision-block">
            <div className="d-title">Fix strategy</div>
            <ul>
              <li>Mild curve → polynomial features: $X^2$ or $X^3$</li>
              <li>Exponential growth → log transform the variable</li>
              <li>U-shape → polynomial terms or bin into categories</li>
              <li>Complex shape → tree-based models or GAMs (handle non-linearity natively)</li>
            </ul>
          </div>
        </div>
      </section>




      <div id="cp3" className="checkpoint-header">
        <div className="cp-num">Checkpoint 3</div>
        <h2>Relationships Between Variables</h2>
        <p>How do your predictors relate to <em>each other</em>? Three problems: multicollinearity (already covered in Ch.1), interaction effects, and confounding.</p>
      </div>


      <section id="interactions">
        <div className="topic-card">
          <h2 className="section-title">Interaction Effects</h2>
          <p className="intro-text">The effect of variable A on the target <strong>changes depending on the value of variable B</strong>. This is not just two variables both influencing the target — it's them modifying each other's influence.</p>
          <p>Example: income reduces default risk strongly for salaried employees — but barely at all for self-employed. The effect of income <em>depends on</em> employment type.</p>

          <div className="gotcha"><strong>Critical:</strong> most models won't automatically create interaction terms. You must engineer them explicitly. Tree-based models are the exception — they detect interactions naturally via splits.</div>

          <h3>Detection</h3>
          <p><strong>Interaction plot:</strong> plot the relationship between continuous X and target separately for each group of a categorical variable. <strong>Crossing lines = interaction present. Parallel lines = no interaction.</strong></p>

          <h3>Statistical Test</h3>
          <p>Add a multiplication term $X_1 \times X_2$ to the model. If the coefficient is significant, the interaction is real.</p>

          <div className="formula-block">
            {String.raw`$$\hat{y} = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_3(X_1 X_2)$$`}
            <p className="formula-label">{String.raw`$\beta_0$`} = intercept · {String.raw`$\beta_1, \beta_2$`} = main effect coefficients · {String.raw`$\beta_3$`} = interaction coefficient. {String.raw`$\partial\hat{y}/\partial X_1 = \beta_1 + \beta_3 X_2$`} — the marginal effect of {'$X_1$'} depends on {'$X_2$'}. Always include both main effects alongside the interaction term.</p>
          </div>

          <pre><code className="language-python">{`import statsmodels.api as sm
from sklearn.preprocessing import StandardScaler

# Centre before creating interaction (massively suppresses structural multicollinearity)
df['X1_c'] = df['X1'] - df['X1'].mean()             # Slide X1 distribution so mean is physically 0
df['X2_c'] = df['X2'] - df['X2'].mean()             # Slide X2 distribution so mean is physically 0
df['X1_X2'] = df['X1_c'] * df['X2_c']               # Multiply components. Positive result means both were same sign.

X_interact = sm.add_constant(df[['X1_c', 'X2_c', 'X1_X2']].dropna()) # Package main effects and interaction effect
model = sm.OLS(df[target][X_interact.index], X_interact).fit() # Train regression on intertwined block
print(f"Interaction p-value: {model.pvalues['X1_X2']:.4f}")    # If p<0.05, X1 and X2 actively augment each other's effects!`}</code></pre>
        </div>
      </section>


      <section id="confounding">
        <div className="topic-card">
          <h2 className="section-title">Confounding</h2>
          <p className="intro-text">A third variable C drives both X and Y, creating a spurious or exaggerated X→Y relationship. Classic example: ice cream sales and drowning rates correlate — not because ice cream causes drowning, but because <em>temperature</em> drives both.</p>

          <div className="two-col">
            <div>
              <h3>vs. Interaction</h3>
              <p><strong>Interaction:</strong> two variables modify each other's effect on the target.</p>
              <p><strong>Confounding:</strong> a third variable secretly drives what looks like a direct relationship.</p>
            </div>
            <div>
              <h3>Types of Bias</h3>
              <p><strong>Confounder in dataset:</strong> model misattributes its effect.</p>
              <p><strong>Confounder absent:</strong> omitted variable bias — systematic wrongness you may never detect.</p>
            </div>
          </div>

          <h3>Detection: Correlation Triangle</h3>
          <p>Ask: Does A↔B weaken substantially when you control for C? If yes → C is confounding the relationship.</p>

          <h3>Detection: Partial Correlation</h3>
          <div className="formula-block">
            {String.raw`$$r_{AB \cdot C} = \frac{r_{AB} - r_{AC} \cdot r_{BC}}{\sqrt{(1-r_{AC}^2)(1-r_{BC}^2)}}$$`}
            <p className="formula-label">
              {String.raw`$r_{AB \cdot C}$`} = partial correlation between A and B controlling for C · {'$r_{AB}$'} = raw correlation. If {String.raw`$|r_{AB \cdot C}| \ll |r_{AB}|$`} → C is confounding. If {String.raw`$r_{AB \cdot C} \approx 0$`} → relationship was entirely spurious.
            </p>
          </div>

          <pre><code className="language-python">{`import pingouin as pg                               # Robust statistics library wrapper

result = pg.partial_corr(                           # Calculate Partial Correlation
    data=df.dropna(),                               # Strip NAs to prevent alignment crashes
    x='X1', y=target,                               # 'We see X1 correlates with Target in raw data...'
    covar=['confounder']                            # '...but what happens if we subtract Confounder's gravitational pull on BOTH?'
)
print(result[['r', 'p-val']])                       # If r craters to 0, X1 was never driving Target. Confounder was pulling strings.`}</code></pre>

          <div className="decision-block">
            <div className="d-title">Action</div>
            <ul>
              <li>Confounder in dataset → add as a control variable in the model</li>
              <li>Confounder absent → acknowledge as a limitation (omitted variable bias)</li>
              <li>Spurious relationship found → drop one variable; they're not telling independent stories</li>
            </ul>
          </div>
        </div>
      </section>




      <div id="cp4" className="checkpoint-header">
        <div className="cp-num">Checkpoint 4</div>
        <h2>Target Variable Behaviour</h2>
        <p>Every prior checkpoint examined inputs. This examines what you're trying to predict. Your target's distribution drives every downstream modelling decision.</p>
      </div>


      <section id="target-dist">
        <div className="topic-card">
          <h2 className="section-title">Target Distribution</h2>
          <p className="intro-text">The shape of the target determines which model family is appropriate. Most people default to linear or logistic regression without checking. Using a linear model on count data can predict negative counts — this is wrong.</p>
          <table>
            <thead><tr><th>Target Distribution</th><th>Appropriate Model Family</th></tr></thead>
            <tbody>
              <tr><td>Continuous, normal</td><td>Linear Regression (OLS)</td></tr>
              <tr><td>Continuous, skewed</td><td>Linear Regression + log transform, or Gradient Boosting</td></tr>
              <tr><td>Binary (0/1)</td><td>Logistic Regression, tree-based classifiers</td></tr>
              <tr><td>Count (0,1,2,3...)</td><td>Poisson Regression or Negative Binomial</td></tr>
              <tr><td>Heavily zero-inflated</td><td>Zero-inflated Poisson / hurdle models</td></tr>
              <tr><td>Time to event</td><td>Survival models (Cox proportional hazards)</td></tr>
            </tbody>
          </table>
          <pre><code className="language-python">{`import scipy.stats as stats                         # Statistical mathematical distributions
import numpy as np

data = df[target].dropna()                          # Baseline array
print(f"Skewness: {data.skew():.3f}")               # >0 is pushed left, tail right. <0 is pushed right, tail left.
print(f"Kurtosis: {data.kurtosis():.3f}")           # >0 means thick tails (outliers common). <0 means thin tails (no outliers).

# Test against distributions continuously
for dist in ['norm', 'lognorm', 'expon']:           # Normal, Log-Normal, Exponential continuous families
    params = getattr(stats, dist).fit(data)         # Fit theoretical distribution forcefully over our real data
    ks, p = stats.kstest(data, dist, params)        # Kolmogorov-Smirnov runs maximum-distance validation against theory
    print(f"{dist}: KS={ks:.4f}, p={p:.4f}")        # Highest p-value wins the distribution profile`}</code></pre>
        </div>
      </section>


      <section id="imbalance">
        <div className="topic-card">
          <h2 className="section-title">Class Imbalance</h2>
          <p className="intro-text">One class heavily outnumbers another. A model trained on 95/5 imbalance achieves <strong>95% accuracy by saying "not fraud" every single time</strong> — catching zero actual fraud. Accuracy becomes a completely meaningless metric.</p>

          <h3>Severity Thresholds</h3>
          <table>
            <thead><tr><th>Ratio</th><th>Severity</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>60/40</td><td>Mild</td><td>Usually fine, change metric</td></tr>
              <tr><td>70/30</td><td>Moderate</td><td>Monitor, change metric</td></tr>
              <tr><td>80/20</td><td>Concerning</td><td>Class weights</td></tr>
              <tr><td>90/10</td><td>Severe</td><td>Class weights + SMOTE</td></tr>
              <tr><td>95/5+</td><td>Extreme</td><td>SMOTE + undersampling or anomaly detection framing</td></tr>
            </tbody>
          </table>

          <div className="formula-block">
            {String.raw`$$w_i = \frac{n_{total}}{n_{classes} \cdot n_{class_i}}, \quad \text{SMOTE: } x_{new} = x_i + \lambda(x_{neighbour} - x_i)$$`}
            <p className="formula-label">{'$w_i$'} = class weight for class {'$i$'} · {'$n_{total}$'} = total samples · {'$n_{classes}$'} = number of classes · {'$n_{class_i}$'} = samples in class {'$i$'}. SMOTE: {String.raw`$\lambda \sim \text{Uniform}(0,1)$`} interpolates between minority sample and its nearest neighbour.</p>
          </div>

          <pre><code className="language-python">{`from imblearn.over_sampling import SMOTE            # Synthetic Minority Oversampling Technique
from sklearn.ensemble import RandomForestClassifier # Random Forest supports innate weighting natively
from sklearn.metrics import classification_report   # F1 scores matter infinitely more than baseline Accuracy here

# Step 1: Class weights (least invasive, always try first before resorting to fake data)
model = RandomForestClassifier(class_weight='balanced', random_state=42) # Automatically scales minority error gradients up heavily
model.fit(X_train, y_train)                         # Let trees train while actively penalizing minority mistakes
print(classification_report(y_test, model.predict(X_test))) # Evaluate precision/recall for minority class

# Step 2: SMOTE if class weights insufficient
smote = SMOTE(random_state=42, k_neighbors=5)       # Generates synthetic data points logically interpolated between real points
X_res, y_res = smote.fit_resample(X_train, y_train) # SMOTE ONLY runs on train set, never ever bleed into Test!
print(f"After SMOTE: {dict(zip(*np.unique(y_res, return_counts=True)))}") # Confirms perfect 50/50 balance achieved mathematically`}</code></pre>

          <div className="gotcha"><strong>Always</strong> use stratified train/test splits with imbalanced data. Change metric to F1, AUC-ROC, or Precision-Recall AUC — never use accuracy.</div>
        </div>
      </section>


      <section id="outliers">
        <div className="topic-card">
          <h2 className="section-title">Target Outliers</h2>
          <p className="intro-text">Outliers in the target are more dangerous than outliers in inputs. In OLS, every extreme value in Y exerts <strong>gravitational pull</strong> on the regression line — distorting coefficients for every variable in the model. One influential observation can shift the model's entire understanding of reality.</p>

          <h3>IQR Rule + Z-Score (initial flagging)</h3>
          <div className="formula-block">
            {String.raw`$$\text{IQR fences: } Q_1 - 1.5 \cdot IQR \text{ and } Q_3 + 1.5 \cdot IQR$$`}
            {String.raw`$$z_i = \frac{x_i - \bar{x}}{s}, \quad |z_i| > 3 \text{ \u2192 flag}$$`}
            <p className="formula-label">{'$Q_1, Q_3$'} = 25th/75th percentile · {'$IQR = Q_3 - Q_1$'} · {'$z_i$'} = z-score · {String.raw`$\bar{x}$`} = mean · {'$s$'} = std. Caution: both assume symmetric data.</p>
          </div>

          <h3>Cook's Distance (influence measure)</h3>
          <div className="formula-block">
            {String.raw`$$D_i = \frac{\sum(\hat{y}_j - \hat{y}_{j(i)})^2}{p \cdot MSE} = \frac{e_i^2}{p \cdot MSE} \cdot \frac{h_i}{(1-h_i)^2}$$`}
            <p className="formula-label">{'$D_i$'} = Cook's distance for observation {'$i$'} · {String.raw`$\hat{y}_{j(i)}$`} = fitted value with obs {'$i$'} removed · {'$e_i$'} = residual · {'$h_i$'} = leverage · {'$p$'} = number of predictors · {'$MSE$'} = mean squared error. {'$D_i > 4/n$'} → investigate · {'$D_i > 1$'} → action needed.</p>
          </div>

          <pre><code className="language-python">{`import statsmodels.api as sm
import numpy as np

model = sm.OLS(y, X).fit()                          # Commit to standard regression topology
influence = model.get_influence()                   # Ask statsmodels to map all internal structural levers
cooks_d, _ = influence.cooks_distance               # Cook's mathematically measures displacement if a row is deleted

n = len(y)                                          # Calculate threshold scaling factors based on dataset size
print(f"Cook's D > 4/n: {sum(cooks_d > 4/n)}")      # Bofinger Threshold: Number of rows actively tugging coefficients away from baseline
print(f"Cook's D > 1:   {sum(cooks_d > 1)}")        # Hard Rule Threshold: Number of extreme rows single-handedly dictating the whole model`}</code></pre>

          <div className="decision-block">
            <div className="d-title">Fix strategy</div>
            <ul>
              <li>Data error → remove, document</li>
              <li>Genuine extreme → winsorise: cap at 99th percentile</li>
              <li>Many outliers in one direction → log transform the target</li>
              <li>High Cook's D → investigate; consider Huber robust regression</li>
            </ul>
          </div>
        </div>
      </section>


      <section id="leakage">
        <div className="topic-card">
          <h2 className="section-title">Target Leakage</h2>
          <p className="intro-text">The most dangerous issue in pre-modelling. Variables containing information about the target that would <strong>not exist at prediction time in production</strong>. Produces spectacular development metrics and complete production failure.</p>

          <div className="gotcha"><strong>The model isn't learning a pattern — it's memorising the answer.</strong></div>

          <h3>The Timeline Test</h3>
          <p>For every variable: <strong>"At the moment I need to make a prediction — does this variable already exist?"</strong></p>
          <p>Example: predicting loan default. Variable: <em>collection calls received</em>. Collection calls happen <em>because</em> someone defaulted. At prediction time (loan approval) this variable doesn't exist yet → leakage.</p>

          <h3>Three Types of Leakage</h3>
          <table>
            <thead><tr><th>Type</th><th>Description</th><th>Fix</th></tr></thead>
            <tbody>
              <tr><td>Direct leakage</td><td>Variable is a direct consequence of the target</td><td>Remove immediately</td></tr>
              <tr><td>Proxy leakage</td><td>Variable doesn't directly leak but encodes the same info</td><td>Also remove</td></tr>
              <tr><td>Pipeline leakage</td><td>Preprocessing used full dataset (including test set) before split</td><td>Fit all transforms on train only</td></tr>
            </tbody>
          </table>

          <div className="formula-block">
            {String.raw`$$\text{WRONG: } \texttt{scaler.fit(X\_all)} \to \texttt{split} \quad \text{(test info leaks in)}$$`}
            {String.raw`$$\text{CORRECT: } \texttt{split} \to \texttt{scaler.fit(X\_train)} \to \texttt{scaler.transform(X\_test)}$$`}
            <p className="formula-label">Always fit ALL preprocessing steps (scalers, imputers, encoders) on training data only. Use sklearn Pipelines to guarantee this holds inside cross-validation too.</p>
          </div>

          <pre><code className="language-python">{`from sklearn.pipeline import Pipeline               # Critical component for preventing target leakage
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score # Without a Pipeline, cross_val_score leaks data universally

# Pipeline guarantees no leakage — transforms fit on train fold only inside CV
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),  # Step 1: Discover median on Train fold, insert laterally into Train + Test slice
    ('scaler',  StandardScaler()),                  # Step 2: Discover mean on Train fold, standardize lateral into Train + Test slice
    ('model',   RandomForestClassifier(random_state=42)) # Step 3: Train strictly on clean Train fold
])

scores = cross_val_score(pipeline, X, y, cv=5, scoring='roc_auc') # All 5 folds execute the exact 1-2-3 pipeline isolation above perfectly
print(f"CV AUC: {scores.mean():.4f} ± {scores.std():.4f}")        # Confirmed mathematically bounded, non-leaking AUC check`}</code></pre>

          <div className="gotcha"><strong>Red flag:</strong> AUC &gt; 0.97 on a non-trivial problem, or a single feature dominating importance (&gt;60%) — investigate for leakage immediately.</div>
        </div>
      </section>

      <hr className="section-divider" />




      <section id="concept-table">
        <div className="topic-card">
          <h2 className="section-title">All Concepts at a Glance</h2>
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Checkpoint</th>
                <th>When to Use</th>
                <th>Key Output</th>
                <th>Action Threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Pearson r</td><td>1</td><td>Continuous vs continuous, normal, no outliers</td><td>r ∈ [-1, 1]</td><td>|r| &lt; 0.1 → consider drop</td></tr>
              <tr><td>Spearman ρ</td><td>1</td><td>Skewed, outliers, or curved relationship</td><td>ρ ∈ [-1, 1]</td><td>ρ &gt;&gt; r → flag non-linearity</td></tr>
              <tr><td>VIF</td><td>1, 3</td><td>Always — checking multicollinearity among inputs</td><td>VIF per feature</td><td>VIF &gt; 10 → must act</td></tr>
              <tr><td>t-test</td><td>1</td><td>Categorical predictor, 2 groups, normal within groups</td><td>t-stat, p-value</td><td>p &lt; 0.05 → groups differ</td></tr>
              <tr><td>ANOVA</td><td>1</td><td>Categorical predictor, 3+ groups, normal within groups</td><td>F-stat, p-value</td><td>p &lt; 0.05 → at least one group differs</td></tr>
              <tr><td>Mann-Whitney U</td><td>1</td><td>2 groups, normality fails</td><td>U-stat, p-value</td><td>p &lt; 0.05 → distributions differ</td></tr>
              <tr><td>Kruskal-Wallis</td><td>1</td><td>3+ groups, normality fails</td><td>H-stat, p-value</td><td>p &lt; 0.05 → at least one group differs</td></tr>
              <tr><td>Tukey HSD</td><td>1</td><td>After significant ANOVA</td><td>Pairwise p-values</td><td>Non-significant pairs → collapse groups</td></tr>
              <tr><td>Chi-Square</td><td>1</td><td>Categorical vs categorical</td><td>χ², p-value</td><td>p &lt; 0.05 → association exists (use with V)</td></tr>
              <tr><td>Cramér's V</td><td>1</td><td>Effect size alongside Chi-Square</td><td>V ∈ [0, 1]</td><td>V &lt; 0.1 → negligible (consider drop)</td></tr>
              <tr><td>Fisher's Exact</td><td>1</td><td>2×2 table with expected cell counts &lt; 5</td><td>p-value, OR</td><td>p &lt; 0.05 → association exists</td></tr>
              <tr><td>Shapiro-Wilk</td><td>2</td><td>Normality test, n &lt; 2000</td><td>W stat, p-value</td><td>p &lt; 0.05 → non-normal → transform</td></tr>
              <tr><td>Jarque-Bera</td><td>2</td><td>Large samples, diagnosing skew vs kurtosis</td><td>JB stat, p-value</td><td>p &lt; 0.05 → non-normal; check S and K</td></tr>
              <tr><td>Breusch-Pagan</td><td>2</td><td>Testing homoscedasticity (default)</td><td>LM stat, p-value</td><td>p &lt; 0.05 → heteroscedasticity</td></tr>
              <tr><td>White's Test</td><td>2</td><td>Non-linear heteroscedasticity suspected</td><td>LM stat, p-value</td><td>p &lt; 0.05 → heteroscedasticity</td></tr>
              <tr><td>LOWESS Curve</td><td>2</td><td>Visual linearity check</td><td>Smooth curve shape</td><td>Bend/curve → flag non-linearity</td></tr>
              <tr><td>Ramsey RESET</td><td>2</td><td>Formal linearity test</td><td>F-stat, p-value</td><td>p &lt; 0.05 → add polynomial features</td></tr>
              <tr><td>Interaction Plots</td><td>3</td><td>Testing for interaction between variables</td><td>Line slopes per group</td><td>Crossing lines → interaction term needed</td></tr>
              <tr><td>Partial Correlation</td><td>3</td><td>Testing for confounding by third variable</td><td>Partial r, p-value</td><td>r drops significantly → C confounds A↔B</td></tr>
              <tr><td>Cook's Distance</td><td>4</td><td>Influential observation detection in target</td><td>D_i per observation</td><td>D &gt; 4/n → investigate; D &gt; 1 → act</td></tr>
              <tr><td>SMOTE</td><td>4</td><td>Severe class imbalance (&gt;80/20)</td><td>Resampled dataset</td><td>Prefer class weights first</td></tr>
              <tr><td>Timeline Test</td><td>4</td><td>Every variable — detecting target leakage</td><td>Yes/No per feature</td><td>No → remove immediately</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="section-divider" />




      <section id="formula-sheet">
        <div className="topic-card">
          <h2 className="section-title">Formula Reference Sheet</h2>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Pearson Correlation</h3>
            <div className="formula-block">{String.raw`$$r = \frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum(x_i-\bar{x})^2\sum(y_i-\bar{y})^2}}, \quad t = \frac{r\sqrt{n-2}}{\sqrt{1-r^2}}$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Spearman Correlation</h3>
            <div className="formula-block">{String.raw`$$\rho = 1 - \frac{6\sum d_i^2}{n(n^2-1)}, \quad d_i = \text{rank}(x_i) - \text{rank}(y_i)$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Variance Inflation Factor</h3>
            <div className="formula-block">{String.raw`$$\text{VIF}_j = \frac{1}{1 - R^2_j}, \quad \text{Tolerance}_j = 1 - R^2_j$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>ANOVA F-statistic</h3>
            <div className="formula-block">{String.raw`$$F = \frac{MS_{between}}{MS_{within}} = \frac{\sum n_j(\bar{y}_j-\bar{y})^2/(k-1)}{\sum\sum(y_{ij}-\bar{y}_j)^2/(N-k)}$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Chi-Square + Cramér's V</h3>
            <div className="formula-block">{String.raw`$$\chi^2 = \sum\frac{(O_{ij}-E_{ij})^2}{E_{ij}}, \quad V = \sqrt{\frac{\chi^2}{N\cdot\min(r-1,c-1)}}$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Shapiro-Wilk + Jarque-Bera</h3>
            <div className="formula-block">{String.raw`$$W = \frac{(\sum a_i x_{(i)})^2}{\sum(x_i-\bar{x})^2}, \quad JB = \frac{n}{6}\left[S^2 + \frac{K^2}{4}\right]$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Breusch-Pagan / White's Test</h3>
            <div className="formula-block">{String.raw`$$LM = n \cdot R^2_{aux} \sim \chi^2(k)$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Interaction Model</h3>
            <div className="formula-block">{String.raw`$$\hat{y} = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_3(X_1 X_2), \quad \frac{\partial\hat{y}}{\partial X_1} = \beta_1 + \beta_3 X_2$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Partial Correlation</h3>
            <div className="formula-block">{String.raw`$$r_{AB\cdot C} = \frac{r_{AB} - r_{AC}\cdot r_{BC}}{\sqrt{(1-r_{AC}^2)(1-r_{BC}^2)}}$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>Cook's Distance</h3>
            <div className="formula-block">{String.raw`$$D_i = \frac{e_i^2}{p\cdot MSE}\cdot\frac{h_i}{(1-h_i)^2}, \quad h_i = x_i'(X'X)^{-1}x_i$$`}</div>
          </div>

          <div className="formula-entry" style={{ marginBottom: '24px' }}>
            <h3>SMOTE Interpolation</h3>
            <div className="formula-block">{String.raw`$$x_{new} = x_i + \lambda(x_{neighbour} - x_i), \quad \lambda \sim \text{Uniform}(0,1)$$`}</div>
          </div>

          <div className="formula-entry">
            <h3>Box-Cox Transformation</h3>
            <div className="formula-block">{String.raw`$$y^{(\lambda)} = \begin{cases} (y^\lambda - 1)/\lambda & \lambda \neq 0 \ \ln(y) & \lambda = 0 \end{cases}$$`}</div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />




      <section id="code-appendix">
        <div className="topic-card">
          <h2 className="section-title">Python Code Reference</h2>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Setup</span></div>
            <pre><code className="language-python">{`import pandas as pd                                 # Data manipulation
import numpy as np                                  # Numerical operations
import matplotlib.pyplot as plt                     # Base plotting library
import seaborn as sns                               # Statistical data visualization
from scipy import stats                             # Fundamental statistical distributions
import statsmodels.api as sm                        # Econometric modeling suite

df = pd.read_csv("your_data.csv")                   # Load raw unmodeled dataframe
target = 'your_target_column'                       # Anchor variable
num_cols = df.select_dtypes(include=np.number).columns.tolist()  # Extract all quantitative features automatically
cat_cols = df.select_dtypes(include='object').columns.tolist()   # Extract all categorical qualitative features`}</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Pearson + Spearman comparison</span></div>
            <pre><code className="language-python">from scipy.stats import pearsonr, spearmanr

              for col in num_cols:
              if col != target:
              r,   _ = pearsonr(df[col].dropna(), df[target].dropna())
              rho, _ = spearmanr(df[col].dropna(), df[target].dropna())
              diff = abs(rho) - abs(r)
              flag = "⚠ CURVED" if diff &gt; 0.1 else ""
              print(f"&#123;col:&lt;25&#125; r=&#123;r:.3f&#125;  ρ=&#123;rho:.3f&#125;  Δ=&#123;diff:.3f&#125; &#123;flag&#125;")</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>VIF — iterative removal</span></div>
            <pre><code className="language-python">from statsmodels.stats.outliers_influence import variance_inflation_factor

              def remove_high_vif(df, cols, thresh=10):
              while True:
              X = sm.add_constant(df[cols].dropna())
              vifs = [variance_inflation_factor(X.values, i) for i in range(1, X.shape[1])]
              max_vif = max(vifs)
              if max_vif &gt; thresh:
              drop = cols[vifs.index(max_vif)]
              print(f"Dropping &#123;drop&#125; (VIF=&#123;max_vif:.1f&#125;)")
              cols = [c for c in cols if c != drop]
              else:
              break
              return cols</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>ANOVA + Kruskal-Wallis</span></div>
            <pre><code className="language-python">from scipy.stats import f_oneway, kruskal, shapiro

              for col in cat_cols:
              groups = [df[df[col]==g][target].dropna() for g in df[col].unique()]
              # Normality check within groups
              all_normal = all(shapiro(g[:2000])[1] &gt; 0.05 for g in groups if len(g) &gt; 3)
              if all_normal:
              stat, p = f_oneway(*groups); test = "ANOVA"
              else:
              stat, p = kruskal(*groups); test = "Kruskal-Wallis"
              print(f"&#123;col&#125; [&#123;test&#125;]: p=&#123;p:.4f&#125;")</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Chi-Square + Cramér's V</span></div>
            <pre><code className="language-python">from scipy.stats import chi2_contingency

              def cramers_v(x, y):
              ct = pd.crosstab(x, y)
              chi2, _, _, exp = chi2_contingency(ct)
              n, r, c = ct.sum().sum(), *ct.shape
              return np.sqrt(chi2 / (n * (min(r,c) - 1))), exp.min()

              for col in cat_cols:
              if col != target:
              v, min_exp = cramers_v(df[col], df[target])
              flag = "⚠ Use Fisher's Exact" if min_exp &lt; 5 else ""
              print(f"&#123;col&#125;: V=&#123;v:.3f&#125; &#123;flag&#125;")</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Normality — Shapiro-Wilk + Box-Cox</span></div>
            <pre><code className="language-python">from scipy.stats import shapiro, boxcox

              for col in num_cols:
              data = df[col].dropna()
              W, p = shapiro(data.sample(min(2000, len(data)), random_state=42))
              if p &lt; 0.05 and data.min() &gt; 0:
              transformed, lam = boxcox(data)
              W2, p2 = shapiro(transformed[:2000])
              print(f"&#123;col&#125;: λ=&#123;lam:.3f&#125; | Before p=&#123;p:.4f&#125; | After p=&#123;p2:.4f&#125;")</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Homoscedasticity — Breusch-Pagan</span></div>
            <pre><code className="language-python">from statsmodels.stats.diagnostic import het_breuschpagan, het_white

              model = sm.OLS(y, X).fit()
              lm, p, _, _ = het_breuschpagan(model.resid, model.model.exog)
              print(f"Breusch-Pagan: LM=&#123;lm:.3f&#125;, p=&#123;p:.4f&#125;")

              if p &lt; 0.05:
              # Option 1: log transform target
              df['log_target'] = np.log1p(df[target])
              # Option 2: robust standard errors
              model_robust = sm.OLS(y, X).fit(cov_type='HC3')</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Linearity — RESET Test + LOWESS</span></div>
            <pre><code className="language-python">{`from statsmodels.stats.diagnostic import linear_reset
import statsmodels.nonparametric.smoothers_lowess as lowess_sm # Local regression smoother curve builder

# RESET test evaluates strict mathematical failure of linearity
reset = linear_reset(model, power=3, use_f=True)    
print(f"RESET p={reset.pvalue:.4f}")

# LOWESS provides visual non-parametric assessment
for col in num_cols[:4]:                            # Plot top 4 to prevent notebook freezing
    data = df[[col, target]].dropna().sort_values(col) # Sort is mandatory for smooth line plotting!
    # frac=0.3 means each point considers nearest 30% of data to curve locally
    smoothed = lowess_sm.lowess(data[target], data[col], frac=0.3) 
    plt.scatter(data[col], data[target], alpha=0.15, s=10) # Base scatter layer
    plt.plot(smoothed[:,0], smoothed[:,1], 'r-', lw=2)     # Smooth red indicator curve overlay
    plt.title(f"LOWESS: {col} vs {target}"); plt.show()`}</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Interaction Effects</span></div>
            <pre><code className="language-python">{`from scipy.stats import chi2

# Centre before interacting to eliminate severe false-positive VIF explosions
df['X1_c'] = df['X1'] - df['X1'].mean()             # Anchors data so X is positive/negative from center
df['X2_c'] = df['X2'] - df['X2'].mean()             # Anchors data so Y is positive/negative from center
df['X1_X2'] = df['X1_c'] * df['X2_c']               # Creates explicit quadrant multiplier

# Likelihood Ratio Test explicitly measures if adding variables justifies the model complexity mathematically
m0 = sm.OLS(y, sm.add_constant(df[['X1_c','X2_c']].dropna())).fit()           # Null model without interaction
m1 = sm.OLS(y, sm.add_constant(df[['X1_c','X2_c','X1_X2']].dropna())).fit()   # Complex model with interaction
lr = -2 * (m0.llf - m1.llf)                         # Compare Log-Likelihood derivatives (LLF)
p  = 1 - chi2.cdf(lr, df=1)                         # P-value derives from Chi2 distribution of difference
print(f"LRT: LR={lr:.3f}, p={p:.4f}")               # p < 0.05 strictly confirms the interaction term is mandatory`}</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Confounding — Partial Correlation</span></div>
            <pre><code className="language-python">{`import pingouin as pg
from scipy.stats import pearsonr                    # Pingouin replaces Pandas for complex partials

raw_r, _ = pearsonr(df['X1'].dropna(),              # Baseline observed correlation (potentially totally false!)
                    df[target].dropna())            

# Isolate relationship between X1 and target holding 'confounder' totally static in space
result = pg.partial_corr(data=df.dropna(), x='X1', y=target, covar=['confounder'])
partial_r = result['r'].values[0]                   # Extract metric

print(f"Raw r:         {raw_r:.3f}")                # e.g., Ice Cream vs Drownings = 0.82
print(f"Partial r:     {partial_r:.3f}")            # Controlling for Summer Heat = 0.04
print(f"Attenuation:   {abs(raw_r) - abs(partial_r):.3f}") # 0.78 of the signal was literally just the confounder!`}</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Cook's Distance</span></div>
            <pre><code className="language-python">{`model = sm.OLS(y, X).fit()                          # Standard evaluation
cooks_d, _ = model.get_influence().cooks_distance   # Calculate row-by-row structural model influence
n = len(y)

import matplotlib.pyplot as plt
plt.stem(range(n), cooks_d,                         # Stem plots are perfect for highlight outlier spikes
         markerfmt=',', linefmt='steelblue', basefmt='gray')
plt.axhline(4/n, color='orange', linestyle='--',    # Orange zone: Observation is tugging coefficients around (Review)
            label=f'4/n={4/n:.4f}')                 
plt.axhline(1,   color='red',    linestyle='--',    # Red zone: Observation is destroying the entire model (Destroy)
            label='D=1')
plt.legend(); plt.title("Cook's Distance Plot"); plt.show()`}</code></pre>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div className="code-label"><span>Class Imbalance — SMOTE Pipeline</span></div>
            <pre><code className="language-python">{`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from imblearn.over_sampling import SMOTE            # Generates synthetic data points logically
from imblearn.pipeline import Pipeline as ImbPipeline # MUST use Imbalanced-Learn pipeline format for SMOTE insertion

# Stratified K-Fold + SMOTE strictly inside ImbPipeline guarantees 0% synthetic data bleeds into Validation Fold!
pipe = ImbPipeline([                                # Sequence of mathematical locks
    ('imputer', SimpleImputer(strategy='median')),  # Clean missingness using Train median
    ('scaler',  StandardScaler()),                  # Scale properly
    ('smote',   SMOTE(random_state=42)),            # Resample Train fold to perfect 50/50 balance internally
    ('model',   RandomForestClassifier(class_weight='balanced', random_state=42)) # Weight and learn
])

# Scoring executes the 4-step sequence entirely isolated 5 separate times, proving robustness!
scores = cross_val_score(pipe, X, y, cv=StratifiedKFold(5), scoring='roc_auc')
print(f"CV AUC: {scores.mean():.4f} ± {scores.std():.4f}")`}</code></pre>
          </div>

        </div>
      </section>


    </>
  );
}
