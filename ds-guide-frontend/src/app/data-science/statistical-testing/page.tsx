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
        // KaTeX not yet loaded — retry after a short delay
        setTimeout(renderMath, 100);
    }
}

export default function StatisticalTestingPage() {
    useEffect(() => {
        // @ts-ignore
        if (window.hljs) window.hljs.highlightAll();
        renderMath();
    }, []);

    return (
        <>
            <div className="hero">
                <div className="hero-label">Study Guide</div>
                <h1>Statistical Testing</h1>
                <p>A principled framework for making decisions under uncertainty — separating real signal from random noise in sampled data.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Statistics</span>
                    <span className="badge badge-green">A/B Testing</span>
                    <span className="badge badge-yellow">Data Science</span>
                </div>
            </div>

            <section className="card" id="foundations">
                <h2 className="card-title">Foundations of Testing</h2>

                <h3>Null Hypothesis (H0) vs Alternative (H1)</h3>
                <p><strong>H0:</strong> "Nothing is happening. Any difference is chance."<br />
                    <strong>H1:</strong> "Something is genuinely happening."</p>

                <h3>P-Value</h3>
                <p>The probability of seeing data as extreme as yours (or more), assuming H0 is true.</p>
                <ul>
                    <li><strong>p &lt; α</strong> → reject H0 → statistically significant</li>
                    <li><strong>p ≥ α</strong> → fail to reject H0</li>
                </ul>
                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>The p-value is NOT the probability that H0 is true. It is how surprising the data is, given H0.</p>
                </div>

                <h3>Type I &amp; Type II Errors</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Error Type</th><th>What Happened</th><th>Probability</th></tr></thead>
                        <tbody>
                            <tr><td>Type I (False Positive)</td><td>Rejected H0, but H0 was true</td><td>= α</td></tr>
                            <tr><td>Type II (False Negative)</td><td>Failed to reject H0, but H1 was true</td><td>= β</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="card" id="choosing-test">
                <h2 className="card-title">Choosing the Right Test</h2>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Data Type</th><th>Groups</th><th>Independent / Paired</th><th>Test</th></tr></thead>
                        <tbody>
                            <tr><td>Continuous</td><td>2</td><td>Independent</td><td>Independent t-test</td></tr>
                            <tr><td>Continuous</td><td>2</td><td>Paired</td><td>Paired t-test</td></tr>
                            <tr><td>Continuous</td><td>3+</td><td>Independent</td><td>ANOVA</td></tr>
                            <tr><td>Categorical</td><td>2+</td><td>Independent</td><td>Chi-Square</td></tr>
                            <tr><td>Continuous (skewed)</td><td>2</td><td>Independent</td><td>Mann-Whitney U</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="card" id="ztest">
                <h2 className="card-title">Z-Test (Means &amp; Proportions)</h2>
                <p className="card-subtitle">The Student's T-Test is the foundational continuous statistical evaluation engineered specifically for comparing the underlying probabilistic means of strictly two isolated, independent datasets. Explicitly rejecting the naive assumption that simple raw mean differences functionally map to universal truth, it elegantly solves interpreting whether a calculated numerical delta is a legitimate structural shift or a mere artifact produced by aggressive intra-group variance inside small sample boundaries. Computationally, it computes precisely how many fundamental standard errors the two independent means reside apart strictly employing {String.raw`$t = (\mu_1 - \mu_2) / (s / \sqrt{n})$`}.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Continuous &amp; Categorical data</span>
                    <span className="badge badge-blue">Massive use in Conversion A/B Testing</span>
                </div>

                <h3>1. One-Sample Z-Test (Means)</h3>
                <p>Used specifically when you have a massive sample size and definitively know the population standard deviation.</p>
                <div className="math-block">
                    {String.raw`$$z = \frac{\bar{x} - \mu}{\frac{\sigma}{\sqrt{n}}}$$`}
                </div>
                <p>Numerator = difference from population mean | Denominator = standard error of the mean</p>

                <pre><code className="language-python">{`from statsmodels.stats.weightstats import ztest
import numpy as np

sample_data = [42, 45, 41, 47, 43, 44, 46, 48, 39, 40] * 4  # Large sample size required
population_mean_hypothesized = 40.0

z_stat, p_value = ztest(sample_data, value=population_mean_hypothesized)
print(f"Z-statistic: {z_stat:.4f}")
print(f"P-value: {p_value:.4f}")`}</code></pre>

                <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />

                <h3>2. Two-Sample Z-Test for Proportions (A/B Testing)</h3>
                <p>This is arguably the <strong>most heavily used Z-test in modern industry</strong>. It is explicitly utilized to fundamentally compare strictly binary conversion rates (e.g., Click-Through Rate, Conversion Rate) between an A and B variant.</p>

                <div className="math-block">{String.raw`$$z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}(1-\hat{p})(\frac{1}{n_1} + \frac{1}{n_2})}}$$`}</div>
                <p>Where {String.raw`$\hat{p}$`} is the strictly pooled proportion of combined total successes across both identical variants.</p>

                <pre><code className="language-python">{`from statsmodels.stats.proportion import proportions_ztest
import numpy as np

# Variant A: 50 conversions out of 1000 visitors (5.0%)
# Variant B: 80 conversions out of 1000 visitors (8.0%)
successes = np.array([50, 80])
trials = np.array([1000, 1000])

# Run the 2-sample proportions Z-test
z_stat, p_value = proportions_ztest(count=successes, nobs=trials)

print(f"Z-statistic: {z_stat:.4f}")
print(f"P-value: {p_value:.4f}")

if p_value < 0.05:
    print("Variant B is statistically significantly different from Variant A.")
else:
    print("No statistically significant difference detected.")`}</code></pre>
            </section>

            <section className="card" id="ttest">
                <h2 className="card-title">Independent T-Test</h2>
                <p className="card-subtitle">The Independent T-Test is the absolute industry standard statistical test for evaluating the objective difference strictly between two fully independent group means. Entirely superseding the legacy Z-Test (which requires practically impossible a-priori knowledge of true population variance), it comprehensively solves estimating structural significance using only isolated sample variance. Computationally, it achieves this by precisely penalizing the resulting test-statistic using the progressively heavier tails of the Student's T-distribution correlated to smaller sample degrees of freedom, acting universally as the undisputed fundamental backbone of continuous metric A/B testing.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Continuous data</span>
                    <span className="badge badge-blue">2 independent groups</span>
                </div>

                <div className="math-block">
                    {String.raw`$$t = \frac{\bar{x}_A - \bar{x}_B}{\sqrt{\frac{s_A^2}{n_A} + \frac{s_B^2}{n_B}}}$$`}
                </div>
                <p>Numerator = signal (group difference) | Denominator = noise (standard error)</p>

                <pre><code className="language-python">{`from scipy import stats                               # Scientific statistics module
import numpy as np                                      # Number crunching

group_a = [42, 45, 41, 47, 43]                          # Control group distribution
group_b = [35, 38, 33, 36, 34]                          # Treatment group distribution

# ttest_ind assumes independent samples (different users). Use ttest_rel for before/after!
t_stat, p_value = stats.ttest_ind(group_a, group_b)     # Compare means while penalizing for high variance
print(f"T-statistic: {t_stat:.4f}")                     # Distance between means scaled by noise (Signal/Noise ratio)
print(f"P-value: {p_value:.4f}")                        # Probability we'd see this gap if the groups were actually identical`}</code></pre>
            </section>

            <section className="card" id="anova">
                <h2 className="card-title">ANOVA &amp; Tukey's HSD</h2>
                <p className="card-subtitle">ANOVA (Analysis of Variance) explicitly acts as a powerful statistical omnibus designed strictly to identify structural significance among the continuous means of three or more disjoint groups. Actively replacing the highly dangerous protocol of compounding sequential pair-wise T-Tests, it definitively solves the fatal explosion of the Family-wise Error Rate (False Positives) practically guaranteed by repeated modular testing. Mathematically, it operates by meticulously comparing the explicit variance identified <em>between</em> differing groups logically against the base isolated variance natively found <em>within</em> those exact groups utilizing an absolute F-statistic ratio.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Continuous data</span>
                    <span className="badge badge-blue">3+ independent groups</span>
                </div>

                <h3>ANOVA (Analysis of Variance)</h3>
                <p>ANOVA asks: is the variance <em>between</em> groups larger than the variance <em>within</em> groups? If yes, at least one group mean is genuinely different.</p>
                <div className="math-block">
                    {String.raw`$$F = \frac{MS_{between}}{MS_{within}}$$`}
                </div>
                <p>A large F-statistic means the groups are far apart relative to the noise inside each group.</p>

                <h3>Tukey's HSD (Post-hoc)</h3>
                <p>ANOVA only tells you that a difference exists <em>somewhere</em>, not which groups differ. Tukey HSD identifies which specific pairs differ while controlling the family-wise error rate.</p>

                <pre><code className="language-python">{`from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd

# Step 1: Omnibus ANOVA — mathematically asks: "Is at least ONE group mean significantly shifting?"
groups = [
    df[df["Education Level"] == level]["Salary"].dropna()   # Strip target column NA's to prevent calculation crashes
    for level in df["Education Level"].dropna().unique()    # Create isolated dynamic array slices per categorical group
]
f_stat, p_value = stats.f_oneway(*groups)                   # Unpack groups dynamically into parametric ANOVA F-test
print(f"ANOVA → F: {f_stat:.3f}, p: {p_value:.3f}")         # Result indicates global divergence

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

                <div className="callout">
                    <strong>Gotcha</strong>
                    <p>Always run ANOVA before Tukey. Running Tukey without a significant ANOVA first is "fishing" — it inflates your chance of finding a spurious result.</p>
                </div>
            </section>

            <section className="card" id="chisquare">
                <h2 className="card-title">Chi-Square Test</h2>
                <p className="card-subtitle">Hypothesis Testing provides the formal mathematical framework necessary to categorically accept or statistically reject assumptions made about systemic data behaviors. Bypassing the critically flawed practice of casually eyeballing differences to confirm subjective bias, it decisively solves the psychological anomaly of perceiving structural patterns strictly within random statistical noise (Apophenia). It technically executes this by mathematically generating a test statistic specifically utilizing sample variance, rigorously computing a final p-value that explicitly determines the absolute probability of the Null Hypothesis matching reality.</p>
                <div className="math-block">
                    {String.raw`$$\chi^2 = \sum \frac{(O - E)^2}{E}, \quad E_{ij} = \frac{\text{Row Total}_i \times \text{Column Total}_j}{\text{Grand Total}}$$`}
                </div>

                <pre><code className="language-python">{`from scipy import stats

observed = [[30, 70],                                       # Count array mapping 2 categorical variables (e.g. Male/Female vs Click/NoClick)
            [50, 50]]

# chi2_contingency analyzes observed counts vs geometrically expected random-chance distributions
chi2_stat, p_value, dof, expected = stats.chi2_contingency(observed) 

print(f"P-value: {p_value:.4f}")                            # If < 0.05, variables are NOT independent. e.g. "Gender drives click behavior"`}</code></pre>
            </section>

            <section className="card" id="power">
                <h2 className="card-title">Power Analysis &amp; Experiment Design</h2>
                <p className="card-subtitle">Power Analysis represents a strict mathematical pre-computation designed solely to calculate exactly how much data is fundamentally required to detect a legitimate business effect. Entirely preventing the incredibly expensive mistake of executing an experiment only to inevitably realize the sample size was too mathematically weak to prove significance (resulting in a severe Type II Error False Negative), it definitively calculates the minimum required participant count (n). Functionally, it relies on locking down an expected Minimum Detectable Effect (MDE), an acceptable Alpha threshold (typically 0.05), and robust Statistical Power (typically 0.80) prior to collecting any real-world data.</p>
                <ul>
                    <li><strong>Alpha (α)</strong>: False positive rate (typically 0.05)</li>
                    <li><strong>Power (1-β)</strong>: Ability to detect real effects (typically 0.80)</li>
                    <li><strong>MDE (Minimum Detectable Effect)</strong>: Smallest difference worth detecting for the business.</li>
                    <li><strong>Sample Size (n)</strong>: Data required per group.</li>
                </ul>

                <div className="math-block">
                    {String.raw`$$n = \frac{2(z_{\alpha/2} + z_{\beta})^2 \sigma^2}{\delta^2}$$`}
                </div>
                <p>Where {String.raw`$\delta$`} represents MDE.</p>

                <h3>Confidence Intervals</h3>
                <p>A range of plausible values for the true effect. Richer than a p-value — tells you size and precision.</p>
                <div className="math-block">
                    {String.raw`$$CI = (\bar{x}_A - \bar{x}_B) \pm t_{crit} \times SE$$`}
                </div>
            </section>
        </>
    );
}
