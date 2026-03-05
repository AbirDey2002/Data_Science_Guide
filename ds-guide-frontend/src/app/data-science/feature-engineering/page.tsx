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
    } else { setTimeout(renderMath, 100); }
}

export default function FeatureEngineeringPage() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            if (window.hljs) window.hljs.highlightAll();
            renderMath();
        }
    }, []);

    return (
        <>
            <div className="hero">
                <div className="hero-label">Study Guide</div>
                <h1>Feature Engineering</h1>
                <p>The process of using domain knowledge and data manipulation to create, transform, or select input variables that make ML models perform better.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Machine Learning</span>
                    <span className="badge badge-green">Statistics</span>
                    <span className="badge badge-yellow">Dimensionality Reduction</span>
                    <span className="badge badge-gray">Deep Learning</span>
                </div>
            </div>

            <section className="card" id="why">
                <h2 className="card-title">Why Feature Engineering</h2>
                <p className="card-subtitle">Raw data is almost never model-ready.</p>

                <div className="badge-container" style={{ marginBottom: '1rem' }}>
                    <span className="badge badge-blue">Before any modelling</span>
                    <span className="badge badge-blue">When raw data has skew or missingness</span>
                </div>

                <h3>Key Principles</h3>
                <ul>
                    <li>Models don't understand context — you have to encode it (e.g. extract <code>is_weekend</code> from a timestamp)</li>
                    <li>Feature engineering often outperforms algorithm selection in impact</li>
                    <li>Better features reduce model complexity and data requirements</li>
                </ul>
                <div className="callout">
                    <strong>Garbage in, garbage out</strong>
                    <p>No algorithm compensates for poorly represented data.</p>
                </div>
            </section>

            <section className="card" id="transforms">
                <h2 className="card-title">Types of Feature Transformations</h2>

                <h3>Distributional Transformations</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Transform</th><th>When</th><th>Watch Out</th></tr></thead>
                        <tbody>
                            <tr><td>log(x)</td><td>Right-skewed, strictly positive</td><td>Zeros — use log(x+1)</td></tr>
                            <tr><td>sqrt(x)</td><td>Moderate right skew, count data</td><td>Negative values</td></tr>
                            <tr><td>Box-Cox</td><td>Optimally approach normality</td><td>Requires positive values</td></tr>
                        </tbody>
                    </table>
                </div>
                <p>Tree-based models are indifferent to skew. Linear models, KNN, and SVMs care a lot.</p>

                <h3>Transform Code</h3>
                <pre><code className="language-python">{`import numpy as np                                    # numerical computing
from scipy.stats import boxcox                        # Box-Cox transformation
from sklearn.preprocessing import PowerTransformer    # Box-Cox & Yeo-Johnson auto

data = df['skewed_feature'].dropna()                  # grab the skewed column, drop NaN

# Log transform — requires strictly positive values
df['log_feature'] = np.log1p(data)                    # log(x+1), safe for zeros

# Square root — moderate right skew, counts
df['sqrt_feature'] = np.sqrt(data)                    # sqrt(x), needs non-negative

# Box-Cox — automatically finds best lambda for normality
transformed, lam = boxcox(data[data > 0])             # requires positive; returns lambda
print(f"Best lambda: {lam:.3f}")                      # lambda near 0 ≈ log transform

# Yeo-Johnson — works with negative values too
pt = PowerTransformer(method='yeo-johnson')           # generalised Box-Cox
df['yj_feature'] = pt.fit_transform(data.values.reshape(-1,1))  # fit + transform`}</code></pre>

                <h3>Categorical Encoding</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Method</th><th>Use Case</th><th>Risk</th></tr></thead>
                        <tbody>
                            <tr><td>One-hot encoding</td><td>Low cardinality nominals</td><td>Feature explosion</td></tr>
                            <tr><td>Target encoding</td><td>High cardinality, strong target signal</td><td>Leaks if not inside CV folds</td></tr>
                            <tr><td>Frequency encoding</td><td>When rarity is signal</td><td>Loses category identity</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Encoding Code</h3>
                <pre><code className="language-python">{`import pandas as pd                                   # dataframe operations
from sklearn.preprocessing import OneHotEncoder       # one-hot encoding
from category_encoders import TargetEncoder           # target (mean) encoding

# ——— One-Hot: low cardinality categorical (< 10 unique) ———
ohe = OneHotEncoder(sparse_output=False,              # return dense array
                     drop='first',                    # drop first to avoid multicollinearity
                     handle_unknown='ignore')          # unknown categories → all zeros
X_ohe = ohe.fit_transform(df[['city', 'color']])      # fit + transform selected columns
print(f"One-hot columns: {ohe.get_feature_names_out()}")  # show generated column names

# ——— Target Encoding: high cardinality categorical ———
te = TargetEncoder(cols=['zipcode'],                   # high cardinality column
                    smoothing=10)                       # regularise small groups
df['zipcode_enc'] = te.fit_transform(df['zipcode'],    # encode using training data
                                      df[target])       # needs target for mean calculation

# ——— Frequency Encoding: when rarity is signal ———
freq = df['category'].value_counts(normalize=True)     # proportion of each category
df['category_freq'] = df['category'].map(freq)         # map proportions to column`}</code></pre>
            </section>

            <section className="card" id="selection">
                <h2 className="card-title">Feature Selection</h2>
                <p className="card-subtitle">Knowing what to remove is as important as knowing what to create.</p>

                <h3>Filter Methods — Statistics First, Model Never</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Test</th><th>Use Case</th></tr></thead>
                        <tbody>
                            <tr><td>Pearson correlation</td><td>Continuous feature vs continuous target</td></tr>
                            <tr><td>Spearman correlation</td><td>Non-linear monotonic or ordinal data</td></tr>
                            <tr><td>ANOVA F-test</td><td>Continuous feature vs categorical target</td></tr>
                            <tr><td>Chi-squared</td><td>Categorical feature vs categorical target</td></tr>
                            <tr><td>Mutual Information</td><td>Any type — captures non-linear dependencies</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout">
                    <p>Filter methods evaluate features in isolation — they miss interaction effects entirely. Use for fast pruning only.</p>
                </div>

                <h3>Filter Methods — Code</h3>
                <pre><code className="language-python">{`import pandas as pd                                    # dataframe operations
import numpy as np                                     # numerical computing
from scipy.stats import pearsonr, spearmanr            # correlation coefficients
from scipy.stats import f_oneway, chi2_contingency     # ANOVA + Chi-Square tests
from sklearn.feature_selection import mutual_info_classif  # mutual information

df = pd.read_csv("your_data.csv")                      # load dataset
target = 'target_column'                               # define target variable
num_cols = df.select_dtypes(include=np.number).columns  # all numeric columns
cat_cols = df.select_dtypes(include='object').columns    # all categorical columns

# ——— Pearson + Spearman correlation (continuous vs continuous) ———
for col in num_cols:
    if col != target:                                   # skip the target itself
        r, p_r     = pearsonr(df[col].dropna(), df[target].dropna())   # linear correlation
        rho, p_rho = spearmanr(df[col].dropna(), df[target].dropna())  # rank-based correlation
        diff = abs(rho) - abs(r)                        # difference hints at non-linearity
        flag = "⚠ CURVED" if diff > 0.1 else ""        # flag if relationship is non-linear
        print(f"{col:25s} r={r:.3f} ρ={rho:.3f} Δ={diff:.3f} {flag}")

# ——— ANOVA F-test (continuous feature vs categorical target) ———
for col in num_cols:
    if col != target:                                   # skip target
        groups = [df[df[target]==g][col].dropna()        # split feature by target classes
                  for g in df[target].unique()]
        stat, p = f_oneway(*groups)                     # one-way ANOVA F-test
        sig = "✓ keep" if p < 0.05 else "✗ drop"       # 5% significance threshold
        print(f"{col:25s} F={stat:.2f} p={p:.4f} {sig}")

# ——— Chi-Square + Cramér's V (categorical vs categorical) ———
def cramers_v(x, y):
    ct = pd.crosstab(x, y)                             # contingency table
    chi2, p, _, _ = chi2_contingency(ct)                # chi-square statistic
    n = ct.sum().sum()                                  # total count
    r, c = ct.shape                                     # rows, columns
    return np.sqrt(chi2 / (n * (min(r,c)-1))), p        # normalised effect size

for col in cat_cols:
    if col != target:                                   # skip target
        v, p = cramers_v(df[col], df[target])            # effect size + p-value
        print(f"{col:25s} V={v:.3f} p={p:.4f}")

# ——— Mutual Information (any type → captures non-linear deps) ———
mi = mutual_info_classif(df[num_cols].fillna(0),        # numeric features (fill NaN)
                          df[target],                    # target variable
                          random_state=42)               # reproducibility
mi_scores = pd.Series(mi, index=num_cols)               # map scores to column names
print(mi_scores.sort_values(ascending=False))            # rank features by importance`}</code></pre>

                <h3>Wrapper &amp; Embedded Methods</h3>
                <ul>
                    <li><strong>Wrapper (RFE):</strong> Uses model performance as the selection criterion. Expensive but captures interactions.</li>
                    <li><strong>Embedded (Lasso/Ridge):</strong> Selection during training. Lasso (L1) drives irrelevant coefficients to zero. Tree importances.</li>
                </ul>

                <h3>Wrapper &amp; Embedded — Code</h3>
                <pre><code className="language-python">{`from sklearn.feature_selection import RFE              # recursive feature elimination
from sklearn.linear_model import LassoCV               # Lasso with cross-validated alpha
from sklearn.ensemble import RandomForestClassifier     # for tree-based importance

# ——— RFE: Wrapper method — selects best k features iteratively ———
rfe = RFE(
    estimator=RandomForestClassifier(n_estimators=100,  # base model for ranking
                                      random_state=42),
    n_features_to_select=10                             # keep top 10 features
)
rfe.fit(X_train, y_train)                               # fit RFE on training data
selected = X_train.columns[rfe.support_]                # boolean mask → column names
print("RFE selected:", list(selected))                  # show selected features

# ——— Lasso: Embedded method — L1 penalty zeroes out irrelevant features ———
lasso = LassoCV(cv=5, random_state=42)                  # 5-fold CV picks best lambda
lasso.fit(X_train, y_train)                             # fit on training data
coefs = pd.Series(lasso.coef_, index=X_train.columns)   # map coefficients to features
kept = coefs[coefs != 0].sort_values(key=abs, ascending=False)  # non-zero = selected
print(f"Lasso kept {len(kept)} features (α={lasso.alpha_:.4f})")
print(kept)                                             # print non-zero coefficients

# ——— Tree-based importances (fast embedded alternative) ———
rf = RandomForestClassifier(n_estimators=200,           # more trees = stable importance
                             random_state=42)
rf.fit(X_train, y_train)                                # train the forest
importances = pd.Series(rf.feature_importances_,        # Gini importance per feature
                         index=X_train.columns)
top_k = importances.nlargest(15)                        # select top 15 features
print("Top features by tree importance:", list(top_k.index))`}</code></pre>
            </section>

            <section className="card" id="dimreduction">
                <h2 className="card-title">Dimensionality Reduction</h2>
                <p className="card-subtitle">Synthesizing new features to compress data. The trade-off: interpretability vs signal density.</p>

                <h3>Principal Component Analysis (PCA)</h3>
                <p>PCA finds directions in feature space along which data varies most, then projects data onto top k directions.</p>
                <div className="math-block">
                    {String.raw`$$C = \frac{1}{n} X_c^T X_c \qquad C \cdot v = \lambda v \qquad X_{red} = X_c \cdot W$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
                    {'$C$'} = covariance matrix · {'$X_c$'} = mean-centred data · {'$v$'} = eigenvector (principal component direction) · {String.raw`$\lambda$`} = eigenvalue (variance explained) · {'$W$'} = matrix of top-k eigenvectors · {'$X_{red}$'} = reduced data
                </p>
                <div className="callout">
                    <p>Scaling is not optional! Features on different scales will dominate the covariance matrix. Always use StandardScaler before PCA.</p>
                </div>

                <h3>Choosing Components</h3>
                <ul>
                    <li><strong>Variance Threshold (95% Rule):</strong> Keep enough components to explain 95% of total variance.</li>
                    <li><strong>Scree Plot / Elbow:</strong> Plot eigenvalues descending, find elbow.</li>
                    <li><strong>Kaiser Criterion:</strong> Keep eigenvalues &gt; 1.</li>
                </ul>
            </section>

            <section className="card" id="autoencoders">
                <h2 className="card-title">Autoencoders — Non-Linear PCA</h2>
                <p className="card-subtitle">Neural network that compresses data to a bottleneck Z and reconstructs X.</p>
                <p>Unlike PCA, which finds straight-line linear combinations, Autoencoders learn curved manifolds.</p>
                <div className="math-block">
                    {String.raw`$$\mathcal{L} = \frac{1}{n} \sum_{i=1}^{n} \|X_i - \hat{X}_i\|^2$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
                    {String.raw`$\mathcal{L}$`} = reconstruction loss (MSE) · {'$X_i$'} = original input · {String.raw`$\hat{X}_i$`} = reconstructed output · {'$n$'} = number of samples
                </p>
                <div className="callout">
                    <p>For tabular ML, PCA is usually the right call. Autoencoders shine when data has genuine non-linear structure — images, audio, sensor signals, embeddings.</p>
                </div>
            </section>

            <section className="card" id="code-appendix">
                <h2 className="card-title">Code Reference</h2>

                <h3>sklearn PCA inside a Pipeline</h3>
                <pre><code className="language-python">{`from sklearn.preprocessing import StandardScaler   # z-score normaliser
from sklearn.decomposition import PCA               # principal component analysis
from sklearn.pipeline import Pipeline                # chains transforms safely
import numpy as np                                   # numerical computing

X = np.random.randn(200, 10)                         # 200 samples, 10 features (synthetic)

pipe = Pipeline([
    ('scaler', StandardScaler()),       # MUST scale before PCA — equalise feature ranges
    ('pca', PCA(n_components=0.95))     # retain 95% of total variance automatically
])
X_reduced = pipe.fit_transform(X)      # fit scaler + PCA on data, return reduced matrix

print(pipe['pca'].n_components_)                       # how many components were kept
print(pipe['pca'].explained_variance_ratio_.cumsum())  # cumulative variance per component`}</code></pre>
            </section>
        </>
    );
}
