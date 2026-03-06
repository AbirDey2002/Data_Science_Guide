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

export default function DeepLearningPage() {
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
                <h1>Deep Learning</h1>
                <p>MLP → CNN → RNN/LSTM/GRU → Transformers — complete architecture guide with PyTorch code.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">PyTorch</span>
                    <span className="badge badge-green">17 Concepts</span>
                    <span className="badge badge-yellow">25+ Formulas</span>
                    <span className="badge badge-gray">Interview Ready</span>
                </div>
            </div>

            {/* ═══════════ PART 1: NEURAL NETWORKS ═══════════ */}
            <h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Neural Networks — MLP</h2>

            {/* MLP */}
            <section className="card" id="mlp">
                <h2 className="card-title">MLP — Multi-Layer Perceptron</h2>
                <p className="card-subtitle">A Multi-Layer Perceptron (MLP) is a baseline feed-forward neural network serving as the mathematical foundation for modern deep learning architectures. Evolving past simple Logistic Regression, it natively solves the inability to learn non-linear decision boundaries by fundamentally stacking multiple layers of linear transformations followed by non-linear activations. It serves as the absolute baseline architecture when dealing with simple structured tabular data.</p>
                <div className="badge-container" style={{ marginBottom: '1rem' }}>
                    <span className="badge badge-blue">Tabular data</span>
                    <span className="badge badge-blue">Classification</span>
                    <span className="badge badge-blue">Regression</span>
                    <span className="badge badge-yellow">Not for images</span>
                    <span className="badge badge-yellow">Not for sequences</span>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Linear / Logistic Regression</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Linear models cannot learn non-linear decision boundaries on their own. They fail on the XOR problem without manual feature engineering.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Introduces hidden layers with non-linear activation functions, acting as a Universal Function Approximator that can learn any continuous pattern.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Standard tabular datasets where gradient boosting is not used, or as the final classification layer appended to CNNs/Transformers.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)} \quad \implies \quad a^{(l)} = \sigma(z^{(l)})$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Cross-Entropy (Classification):</strong> Used because it heavily penalizes confident but wrong predictions. By chain rule, the derivative of Cross-Entropy combined with Softmax simplifies beautifully to {String.raw`$p_i - y_i$`} (predicted probability minus true one-hot label), giving a clean, direct gradient.<br /><strong>MSE (Regression):</strong> Penalizes large errors quadratically. Its derivative simplifies to {String.raw`$2(y_{pred} - y_{true})$`}, providing direct, proportional error feedback.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>Adam:</strong> I generally default to Adam because it combines momentum (to glide through flat regions smoothly) and adaptive scaling (to handle sparse or noisy gradients), converging far faster than pure SGD without needing intense manual rate tuning.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Logits or probabilities {String.raw`$\in [0, 1]$`} per class</span>
                    </div>
                </div>
                <h3>Architecture Pattern</h3>
                <p>Stacked Linear layers with nonlinear activations. Each layer: {'$z = Wx + b$'}, then {String.raw`$a = \sigma(z)$`}. Without activations, all layers collapse to a single linear transformation.</p>
                <h3>Starting Recipe</h3>
                <ul>
                    <li>2 hidden layers, funnel pattern: [128, 64]</li>
                    <li>Optimizer: Adam, lr=1e-3</li>
                    <li>Batch size: 32 &nbsp;|&nbsp; Epochs: 1000 with early stopping (patience=10)</li>
                    <li>Dropout(0.3) between layers if overfitting</li>
                </ul>
                <div className="callout"><strong>Gotcha:</strong> Without activation functions, stacking layers is mathematically identical to one linear layer — {String.raw`$W_3 W_2 W_1 x = W_{\text{combined}} x$`}. ReLU is non-negotiable.</div>
            </section>

            {/* FORWARD PASS */}
            <section className="card" id="forward-pass">
                <h2 className="card-title">Forward Pass</h2>
                <p className="card-subtitle">The forward pass is the sequential operation of fundamentally pushing input data unilaterally through the network layers to generate a prediction. It natively solves the need to generate a mathematical probability structure required to subsequently evaluate the network error against the true labels. It operates by iteratively computing {String.raw`$a = \sigma(Wx + b)$`} layer by layer, generating outputs natively during both training phases and active production inference runs.</p>
                <div className="math-block">
                    {String.raw`$$z^{(l)} = W^{(l)} \cdot a^{(l-1)} + b^{(l)}$$`}
                    {String.raw`$$a^{(l)} = \sigma(z^{(l)})$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$W^{(l)} \in \mathbb{R}^{\text{out} \times \text{in}}$`} = weight matrix for layer {'$l$'} · {'$a^{(0)} = x$'} (input) · {String.raw`$\sigma$`} = activation function (ReLU, sigmoid, etc.)</p>

                <h3>Weight Matrix Dimensions</h3>
                <p>Rule: {String.raw`$W^{(l)} \in \mathbb{R}^{d_{\text{out}} \times d_{\text{in}}}$`}. For 8→16→8→1: {'$W_1$'} is (16×8), {'$W_2$'} is (8×16), {'$W_3$'} is (1×8).</p>
                <div className="math-block">
                    {String.raw`$$\text{params per layer} = d_{\text{out}} \times d_{\text{in}} + d_{\text{out}}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$d_{\text{out}}$`} = neurons in output · {String.raw`$d_{\text{in}}$`} = neurons in input · the {String.raw`$+d_{\text{out}}$`} = bias terms</p>
            </section>

            {/* RELU */}
            <section className="card" id="relu">
                <h2 className="card-title">ReLU Activation</h2>
                <p className="card-subtitle">Activation functions, distinctly the modern default ReLU, are powerful non-linear mathematical constraints explicitly applied to the output of each layer. Replacing archaic step functions or pure linear outputs, they natively allow a network to learn complex, highly non-linear geometric manifolds, preventing deep networks from collapsing algebraically into a single linear equation. They are structurally applied to the raw logits immediately after every hidden layer's native linear transformation.</p>
                <div className="math-block">
                    {String.raw`$$\text{ReLU}(x) = \max(0, x)$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>Kills negative values, passes positives unchanged. Gradient = 1 for x&gt;0, gradient = 0 for x&lt;0.</p>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Activation</th><th>Formula</th><th>Gradient Issue</th><th>Use When</th></tr></thead>
                        <tbody>
                            <tr><td>ReLU</td><td>max(0,x)</td><td>Dead neurons if x&lt;0</td><td>Default hidden layers</td></tr>
                            <tr><td>Sigmoid</td><td>1/(1+e⁻ˣ)</td><td>Vanishing for large |x|</td><td>Binary output</td></tr>
                            <tr><td>tanh</td><td>(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)</td><td>Vanishing for large |x|</td><td>RNN hidden state</td></tr>
                            <tr><td>Softmax</td><td>eˣⁱ/Σeˣʲ</td><td>—</td><td>Multi-class output</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* BACKPROP */}
            <section className="card" id="backprop">
                <h2 className="card-title">Backpropagation + Training Loop</h2>
                <p className="card-subtitle">Backpropagation is the absolute core mechanism of neural network training that dictates exactly how much each mathematical weight linearly contributed to the final aggregated error. Abandoning the computational impossibility of random weight guessing, it explicitly solves the massive credit assignment problem structurally across billions of stacked parameters. It works precisely by applying the foundational chain rule of calculus directly backwards from the loss function down to the initial input layer instantly after every training forward pass.</p>
                <h3>The 4-Step Loop</h3>
                <ol>
                    <li><strong>optimizer.zero_grad()</strong> — clear gradients from previous step (PyTorch accumulates)</li>
                    <li><strong>logits = model(x)</strong> — forward pass</li>
                    <li><strong>loss.backward()</strong> — backprop: fills .grad on all W and b</li>
                    <li><strong>optimizer.step()</strong> — update: {String.raw`$W \leftarrow W - \eta \cdot \nabla_W L$`}</li>
                </ol>
                <div className="math-block">
                    {String.raw`$$W \leftarrow W - \eta \cdot \frac{\partial L}{\partial W}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$W$'} = weight · {String.raw`$\eta$`} = learning rate · {'$L$'} = loss function · {String.raw`$\partial L / \partial W$`} = gradient of loss w.r.t. weight</p>
                <div className="callout"><strong>Gotcha:</strong> Never forget optimizer.zero_grad(). PyTorch accumulates gradients — skipping it adds this step's gradients to last step's, corrupting training.</div>
            </section>

            {/* ADAM */}
            <section className="card" id="adam">
                <h2 className="card-title">Adam Optimizer</h2>
                <p className="card-subtitle">The Adam Optimizer is the algorithm directly responsible for translating pure mathematical gradients into active structural weight updates. Superseding standard Gradient Descent, it drastically solves the severe instability of navigating massively non-convex and chaotic high-dimensional loss landscapes. It operates by iteratively stepping contrary to the gradient slope using natively smoothed momentum alongside tightly adaptive individual learning rates, acting as the undisputed default optimizer for virtually all neural architectures.</p>
                <div className="math-block">
                    {String.raw`$$m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t \quad \text{(momentum)}$$`}
                    {String.raw`$$v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2 \quad \text{(adaptive rate)}$$`}
                    {String.raw`$$W \leftarrow W - \eta \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$m_t$'} = 1st moment (momentum) · {'$v_t$'} = 2nd moment (adaptive rate) · {'$g_t$'} = gradient · {String.raw`$\hat{m}, \hat{v}$`} = bias-corrected. Defaults: {String.raw`$\eta$`}=1e-3, {String.raw`$\beta_1$`}=0.9, {String.raw`$\beta_2$`}=0.999, {String.raw`$\varepsilon$`}=1e-8</p>
            </section>

            {/* DROPOUT */}
            <section className="card" id="dropout">
                <h2 className="card-title">Dropout</h2>
                <p className="card-subtitle">Dropout is a harsh regularization framework that explicitly destroys established local neural pathways arbitrarily during active training rounds. Enhancing classical L1/L2 Weight Decay, it natively solves severe neural network overfitting and the lazy co-adaptation of linked neurons. Structurally, it randomly zeroes out a strict percentage of functional neurons in a layer at each training step, aggressively forcing the holistic network to distribute learned representations broadly when training deep networks with severely limited data.</p>
                <div className="math-block">
                    {String.raw`$$\tilde{a} = a \cdot \text{Bernoulli}(p) \;/\; p$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$p$'} = keep probability · Scale survivors by {'$1/p$'} to preserve expected value. At test time: all neurons active (model.eval()).</p>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Location</th><th>Typical rate p (keep)</th></tr></thead>
                        <tbody>
                            <tr><td>Hidden layers (MLP)</td><td>0.3–0.5</td></tr>
                            <tr><td>Before output layer</td><td>0.1–0.2</td></tr>
                            <tr><td>Conv layers (Dropout2d)</td><td>0.2–0.3</td></tr>
                            <tr><td>Input/Output layer</td><td>Never</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout"><strong>Gotcha:</strong> model.train() enables dropout. model.eval() disables it. Forgetting model.eval() at inference gives stochastic, wrong predictions.</div>
            </section>

            {/* EARLY STOPPING */}
            <section className="card" id="early-stopping">
                <h2 className="card-title">Early Stopping</h2>
                <p className="card-subtitle">Early Stopping is an automated training termination mechanism based purely on empirical generalisation performance. It solves the blind guessing game of setting fixed epochs and completely halts chronic structural over-training. It natively monitors the strict validation loss per epoch, cleanly terminating training if the loss utterly stops improving after a pre-set 'patience' threshold, permanently locking in the absolute best historical weights encountered during every single deep learning training loop.</p>
                <h3>Algorithm</h3>
                <ol>
                    <li>Track best_val_loss and a patience counter</li>
                    <li>If val_loss improves by &gt; min_delta: save weights, reset counter</li>
                    <li>Otherwise: increment counter</li>
                    <li>If counter ≥ patience: restore best weights, stop</li>
                </ol>
                <p>Set patience=10–20, min_delta=1e-4. Set epochs=1000 and let early stopping decide.</p>
                <div className="callout"><strong>Gotcha:</strong> Monitor val_loss, never train_loss. Restoring best weights (not final) is critical — the model at the stopping point has already degraded.</div>
            </section>

            {/* ═══════════ PART 2: CNNs ═══════════ */}
            <h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>CNNs — Convolutional Neural Networks</h2>

            {/* CNN INTRO */}
            <section className="card" id="cnn-intro">
                <h2 className="card-title">Why CNNs for Images</h2>
                <p className="card-subtitle">Convolutional Neural Networks (CNNs) are custom-designed architectures strictly engineered for spatial and grid-like data (e.g., images). Replacing standard MLPs that catastrophically destroy spatial relationships by flattening images into 1D arrays, CNNs natively use localized filters that share weights across the entire image. They are the absolute foundational standard for Computer Vision and any task demanding spatial or positional invariance.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Multi-Layer Perceptron (MLP)</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>MLPs flatten 2D images into 1D arrays, destroying absolute spatial structure. They also require an individual weight for every single pixel, leading to immense overfitting and parameter explosion on large images.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Uses local receptive fields and weight sharing (convolution filters) to extract hierarchical spatial features (edges $\implies$ shapes $\implies$ objects) translationally invariant.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Computer Vision (Image Classification, Object Detection, Segmentation).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$(f * g)[i,j] = \sum_m \sum_n f[m,n] g[i-m, j-n]$`} — element-wise multiplication sum over a sliding local window.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Categorical Cross-Entropy:</strong> It pushes the network to increase the predicted probability of the correct class while squashing the others. Thanks to chain rule simplification, passing the flattened feature outputs through Softmax and CE yields the gradient $p_i - y_i$, seamlessly feeding error signals back through the dense layers into the convolutional filters without complex cascading derivatives.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>Adam or RMSProp:</strong> CNNs have significantly different gradient scales between deep convolutional filters and flat output layers. Adam/RMSProp adapt per-parameter learning rates, keeping the different layers learning stably.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Feature maps flattened into fully connected layers $\implies$ Class Probabilities</span>
                    </div>
                </div>
                <h3>Two Problems CNNs Solve</h3>
                <ul>
                    <li><strong>Translation invariance</strong> — a cat in any corner is still a cat. Weight sharing makes one filter detect the pattern everywhere.</li>
                    <li><strong>Local patterns</strong> — edges, textures, shapes are made of nearby pixels. A 3×3 filter captures this; a fully-connected layer cannot.</li>
                </ul>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th></th><th>MLP on Image</th><th>CNN</th></tr></thead>
                        <tbody>
                            <tr><td>Params (28×28→512)</td><td>400K+</td><td>9 (3×3 kernel)</td></tr>
                            <tr><td>Spatial structure</td><td style={{ color: '#f85149' }}>Thrown away</td><td style={{ color: '#3fb950' }}>Preserved</td></tr>
                            <tr><td>Translation invariant</td><td style={{ color: '#f85149' }}>No</td><td style={{ color: '#3fb950' }}>Yes</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* CONVOLUTION */}
            <section className="card" id="convolution">
                <h2 className="card-title">The Convolution Operation</h2>
                <p className="card-subtitle">The Convolution operation is the core mathematical engine of a CNN used to extract localized contextual features. It natively solves the severe parameter explosion and lack of translation invariance found in dense layers by sliding small, explicitly learnable filter matrices (kernels) across the input space to compute dot products. It is the mandatory continuous operation used when processing spatial data where important structural features can appear anywhere.</p>
                <div className="math-block">
                    {String.raw`$$\text{Output}(i,j) = \sum_m \sum_n \text{Input}(i+m,\; j+n) \cdot K(m,n)$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$K$'} = kernel (filter) · {'$m, n$'} = kernel indices · Same {'$K$'} reused at every position = weight sharing</p>

                <h3>Output Size Formula</h3>
                <div className="math-block">
                    {String.raw`$$\text{out} = \left\lfloor \frac{\text{in} + 2p - k}{s} \right\rfloor + 1$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$\text{in}$`} = input size · {'$p$'} = padding · {'$k$'} = kernel size · {'$s$'} = stride. With k=3, p=1, s=1: out = in (size preserved).</p>
            </section>

            {/* POOLING */}
            <section className="card" id="pooling">
                <h2 className="card-title">Pooling</h2>
                <p className="card-subtitle">Pooling is a structural downsampling layer natively interleaved between convolutional blocks. Discarding archaic strided convolutions, it elegantly solves the problem of excessive spatial resolution and spiraling computational costs as networks deepen by applying a non-learnable mathematical operation (like Max) over small fixed windows. This ensures the network structurally retains only the absolute most aggressively activating features while shrinking the dimensionality.</p>
                <p>"I typically use <strong>Max Pooling</strong> to keep the strongest activation in a local region, which effectively asks: 'Did I detect this specific feature anywhere in this patch?'"</p>
                <p>"At the very end of my deep networks like ResNet, I replace the traditional Flatten operation with <strong>Global Average Pooling (GAP)</strong> to collapse each spatial feature map into a single number, drastically reducing parameters."</p>
            </section>

            {/* CHANNELS */}
            <section className="card" id="channels">
                <h2 className="card-title">Multiple Filters &amp; Channels</h2>
                <p className="card-subtitle">"Strategic architectural principles for building robust spatial networks." | <strong>Predecessor:</strong> Ad-hoc network sizing. | <strong>Solves:</strong> Guesswork in architecture design. | <strong>How:</strong> Systematically decreasing spatial dimensions via pooling while simultaneously increasing channel depth to capture high-level semantics. | <strong>When:</strong> Designing any custom CNN from scratch.</p>
                <div className="math-block">
                    {String.raw`$$\text{params per Conv2d} = d_{\text{out}} \times (k \times k \times d_{\text{in}}) + d_{\text{out}}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$d_{\text{out}}$`} = output channels · {'$k$'} = kernel size · {String.raw`$d_{\text{in}}$`} = input channels. A layer 64→128 with k=3: 128×(9×64)+128 = 73,856.</p>
                <h3>Typical Progression</h3>
                <p>Channels grow, space shrinks: 3 → 64 → 128 → 256 → 512. Space: 224 → 112 → 56 → 28 → 7.</p>
                <div className="callout"><strong>Gotcha:</strong> PyTorch image tensors are always (batch, channels, H, W). Forgetting channel order is the most common shape bug.</div>
            </section>

            {/* RESNET */}
            <section className="card" id="resnet">
                <h2 className="card-title">ResNet — Skip Connections</h2>
                <p className="card-subtitle">ResNet is an ultra-deep CNN architecture explicitly defined by its integration of residual skip connections. Superseding shallow models like VGG, it definitively solves the catastrophic vanishing gradient problem that aggressively prevented historically training networks deeper than roughly 30 layers. It functions by mathematically adding the original input tensor cleanly to the output of a convolutional block ({String.raw`$F(x) + x$`}), creating uninterrupted gradient super-highways required for virtually all modern generic image recognition tasks.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>VGG / Traditional Deep CNNs</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>As networks got deeper, gradients would exponentially shrink to zero during backpropagation (Vanishing Gradient Problem), preventing learning in early layers. Accuracy would actually degrade with more layers.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Introduced Skip Connections (Residual Blocks) that provide an alternate shortcut path for gradients to bypass activation functions and flow unhindered all the way back to early layers.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Backbone for modern Computer Vision tasks requiring very deep networks.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Instead of learning $H(x)$, it learns the residual $F(x) = H(x) - x$. The output is {String.raw`$y = F(x) + x$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Categorical Cross-Entropy:</strong> Evaluates class probability distributions as with standard CNNs. Chain rule converts it to $p_i - y_i$. Skip connections mean this error gradient doesn't diminish as it travels back.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>SGD with Momentum / Adam:</strong> For extremely deep ResNets on ImageNet, SGD with momentum and learning rate scheduling historically yields slightly better generalization than Adam by finding broader, flatter minima.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Class Probabilities (after Global Average Pooling)</span>
                    </div>
                </div>
                <div className="math-block">
                    {String.raw`$$\text{output} = F(x) + x$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$F(x)$'} = residual mapping (what needs to change) · {'$x$'} = identity shortcut. If {String.raw`$F(x) \approx 0$`}, layer becomes identity. Gradient flows through {'$+$'} directly.</p>

                <h3>ResNet Architecture Diagram</h3>
                <img src="https://miro.medium.com/v2/resize:fit:1400/1*6hF97Upuqg_LdsqWY6n_wg.png" alt="ResNet skip connection architecture showing identity shortcut bypassing conv layers" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--color-border)' }} />

                <h3>Residual Block Pattern</h3>
                <pre><code className="language-python">{`def forward(self, x):
    residual = x                  # save input for skip connection
    out = self.conv1(x)           # first 3x3 convolution
    out = self.bn1(out)           # batch normalise activations
    out = F.relu(out)             # nonlinear activation
    out = self.conv2(out)         # second 3x3 convolution
    out = self.bn2(out)           # batch normalise again
    out = out + residual          # ADD skip connection (gradient highway)
    return F.relu(out)            # activate AFTER adding`}</code></pre>
                <div className="callout"><strong>Gotcha:</strong> If in_channels ≠ out_channels, shapes don't match for +. Fix with a 1×1 conv on the skip path to project dimensions.</div>
            </section>

            {/* TRANSFER LEARNING */}
            <section className="card" id="transfer">
                <h2 className="card-title">Transfer Learning</h2>
                <p className="card-subtitle">Transfer Learning is the undisputed modern paradigm of deep learning where a rigorously trained network is repurposed for a new, highly specific task. Replacing the agonizingly slow method of randomly initializing weights and training exclusively from scratch, it solves the catastrophic reality that most businesses completely lack the billion-scale datasets required to converge modern architectures. It fundamentally operates by freezing the pre-trained feature extraction backbone and merely swapping out the final output head, acting as the absolute default starting point for production data science.</p>
                <h3>Two Modes</h3>
                <ul>
                    <li><strong>Feature extraction</strong> — freeze backbone, train head only. Fast, few params.</li>
                    <li><strong>Fine-tuning</strong> — unfreeze all/some layers, train at low lr (1e-5). Slower, better for different domains.</li>
                </ul>
                <pre><code className="language-python">{`# Freeze backbone — prevent weight updates in pretrained layers
for param in model.backbone.parameters():
    param.requires_grad = False            # no gradient computation

# Only pass trainable params to optimizer — saves memory
optimizer = torch.optim.Adam(
    filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3
)

# Unfreeze for fine-tuning — allow all weights to adapt
for param in model.backbone.parameters():
    param.requires_grad = True             # re-enable gradients`}</code></pre>
            </section>

            {/* ═══════════ PART 3: SEQUENCES ═══════════ */}
            <h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Sequences — RNN, LSTM, GRU</h2>

            {/* RNN */}
            <section className="card" id="rnn">
                <h2 className="card-title">RNN — Recurrent Neural Network</h2>
                <p className="card-subtitle">Recurrent Neural Networks (RNNs) are sequential architectures fundamentally engineered to retain a hidden mathematical state across temporal steps. Bypassing rigid MLPs that strictly demand fixed input dimensions, RNNs solve the necessity of mathematically processing time-series sequences of highly variable lengths (like language or stock prices). They operate by feeding the processed output of the current time step continuously directly back into the network as input for the subsequent step.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>MLP / CNN</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Feedforward networks have no memory. They cannot natively process sequential data of variable length where historical order matters (like text or time-series).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}> What it Solves:</strong>
                        <span>Maintains an internal hidden state memory that persists across time steps, feeding previous history into the current prediction.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}> Where to Use:</strong>
                        <span>Short sequence tracking, simple time-series analysis (though entirely largely superseded by LSTM/GRU).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}> Math Under Hood:</strong>
                        <span>{String.raw`$h_t = \tanh(W_h h_{t-1} + W_x x_t + b)$`} — current state is a combination of previous state and current input.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}> Loss Rationale:</strong >
                        <span><strong>Cross-Entropy / MSE:</strong> Evaluates sequential outputs token by token. For sequences, error gradients from this loss are passed back through time (BPTT).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>Adam:</strong> Handles the varying gradient magnitudes across time steps much better than SGD.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Hidden state vector $h_t$ per time step, often mapped to vocab logits</span>
                    </div >
                </div >
                <div className="math-block">
                    {String.raw`$$h_t = \tanh(W_x \cdot x_t + W_h \cdot h_{t-1} + b)$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$h_t$'} = hidden state at time {'$t$'} · {'$W_x$'} = input→hidden weights · {'$W_h$'} = hidden→hidden weights · {'$x_t$'} = input at time {'$t$'}</p>
                <div className="callout"><strong>Vanishing Gradients:</strong> Backprop multiplies by {'$W_h^T$'} at every step. If {'$|W_h| < 1$'}, gradient shrinks to zero. RNNs forget long-range dependencies → use LSTM or GRU.</div>
                <pre><code className="language-python">{`self.rnn = nn.RNN(input_size=5, hidden_size=32, batch_first=True)  # define RNN layer
out, h_n = self.rnn(x)          # out: (batch, seq, hidden) — all timesteps
last = out[:, -1, :]            # last timestep = sequence summary for classification`}</code></pre>
            </section >

            {/* LSTM */}
            < section className="card" id="lstm" >
                <h2 className="card-title">LSTM — Long Short-Term Memory</h2>
                <p className="card-subtitle">Long Short-Term Memory (LSTM) is a highly complex recurrent cell containing explicit internal gating mechanisms. Superseding vanilla RNNs, LSTMs decisively solve the severe Vanishing/Exploding Gradient anomaly that practically prevented standard RNNs from remembering temporal context beyond a few steps. They achieve this by establishing an uninterrupted central 'cell state' highway spanning the sequence, guarded exclusively by learned sigmoidal gates determining precisely what data to keep or destroy.</p>

                <img src="https://colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-chain.png" alt="LSTM cell architecture showing forget gate, input gate, and output gate with cell state highway" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--color-border)', background: 'white', padding: '0.5rem' }} />


                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Vanilla RNN</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Vanilla RNNs suffer catastrophically from Vanishing Gradients over long sequences. They completely forget older context because they repeatedly multiply the same weight matrix at every time step.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Introduces a protected "Cell State" conveyor belt with active Gating (Forget, Input, Output) to explicitly decide what to remember, what to add, and what to forget.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Time-series forecasting, legacy NLP sequence modelling, speech recognition.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Forget Gate: {String.raw`$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$`} | Update: {String.raw`$C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Cross-Entropy / MSE:</strong> The same as RNNs, but thanks to the cell state highway, the chain rule allows the error gradient from the final prediction to easily backpropagate to the very first token without vanishing.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>Adam:</strong> Works well, though gradient clipping is still strictly required to prevent exploding gradients.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Cell state $C_t$ and Hidden state $h_t$</span>
                    </div>
                </div >
                <div className="math-block">
                    {String.raw`$$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f) \quad \text{(forget gate)}$$`}
                    {String.raw`$$i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i), \quad \tilde{g}_t = \tanh(W_g \cdot [h_{t-1}, x_t] + b_g) \quad \text{(input gate)}$$`}
                    {String.raw`$$c_t = f_t \odot c_{t-1} + i_t \odot \tilde{g}_t \quad \text{(cell update)}$$`}
                    {String.raw`$$o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o), \quad h_t = o_t \odot \tanh(c_t) \quad \text{(output gate)}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$\sigma$`} = sigmoid (0–1 gate) · {String.raw`$\odot$`} = element-wise multiply · {'$f_t$'} = forget gate · {'$i_t$'} = input gate · {'$o_t$'} = output gate · {'$c_t$'} = cell state (memory highway) · {'$h_t$'} = hidden state (output). Params = {String.raw`$4 \times ((d_{\text{in}}+d_h) \times d_h + d_h)$`}.</p>

                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Gate</th><th>Controls</th><th>Analogy</th></tr></thead>
                        <tbody>
                            <tr><td>Forget {'$f_t$'}</td><td>What to erase from {'$c_{t-1}$'}</td><td>Tear out old notebook pages</td></tr>
                            <tr><td>Input {String.raw`$i_t + \tilde{g}_t$`}</td><td>What new info to write</td><td>Write new notes</td></tr>
                            <tr><td>Output {'$o_t$'}</td><td>What to expose as {'$h_t$'}</td><td>Which page to show</td></tr>
                        </tbody>
                    </table>
                </div>
                <pre><code className="language-python">{`self.lstm = nn.LSTM(input_size=5, hidden_size=32, batch_first=True)  # define LSTM
out, (h_n, c_n) = self.lstm(x)  # c_n is LSTM-only cell state (no GRU equivalent)
last = out[:, -1, :]             # last timestep for classification`}</code></pre>
            </section >

            {/* GRU */}
            < section className="card" id="gru" >
                <h2 className="card-title">GRU — Gated Recurrent Unit</h2>
                <p className="card-subtitle">Gated Recurrent Units (GRUs) are highly streamlined, efficient recurrent cells engineered to perform nearly identically to LSTMs using far fewer parameters. They intentionally solve the excessive computational bloat generated by the LSTM's independent hidden and cell states simply by merging them directly into a single unified temporal state, making them the superior choice for computationally constrained sequential environments natively lacking the resources for heavy LSTMs.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>LSTM</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>LSTMs are highly effective but parameter-heavy and computationally expensive due to having 3 distinct gates and a separate hidden and cell state.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Simplifies the LSTM architecture by merging the hidden and cell state into one, and reducing the 3 gates to 2 (Update and Reset gates), achieving similar performance much faster.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>When LSTM-level memory is needed but computational/memory resources are tight; fast time-series modeling.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>{String.raw`$h_t = (1 - z_t) * h_{t-1} + z_t * \tilde{h}_t$`}, where $z_t$ is the update gate balancing past vs present.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Cross-Entropy / MSE:</strong> Uses standard sequential losses. Chain rule gradients propagate smoothly through the update gate.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>Adam:</strong> Accelerates training efficiently across sequential contexts.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Single unified Hidden State $h_t$</span>
                    </div >
                </div >
                <div className="math-block">
                    {String.raw`$$r_t = \sigma(W_r \cdot [h_{t-1}, x_t] + b_r) \quad \text{(reset gate)}$$`}
                    {String.raw`$$z_t = \sigma(W_z \cdot [h_{t-1}, x_t] + b_z) \quad \text{(update gate)}$$`}
                    {String.raw`$$\tilde{h}_t = \tanh(W_h \cdot [r_t \odot h_{t-1},\; x_t] + b_h) \quad \text{(candidate)}$$`}
                    {String.raw`$$h_t = (1-z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t \quad \text{(interpolation)}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$r_t$'} = reset gate (how much past to forget) · {'$z_t$'} = update gate (blend old/new). {'$(1-z_t)$'} and {'$z_t$'} sum to 1. Params = {String.raw`$3 \times ((d_{\text{in}}+d_h) \times d_h + d_h)$`}.</p>

                <div className="table-wrapper">
                    <table>
                        <thead><tr><th></th><th>RNN</th><th>LSTM</th><th>GRU</th></tr></thead>
                        <tbody>
                            <tr><td>States</td><td>{'$h_t$'}</td><td>{'$h_t + c_t$'}</td><td>{'$h_t$'}</td></tr>
                            <tr><td>Gates</td><td>None</td><td>3</td><td>2</td></tr>
                            <tr><td>Long-range memory</td><td style={{ color: '#f85149' }}>Poor</td><td style={{ color: '#3fb950' }}>Excellent</td><td style={{ color: '#3fb950' }}>Good</td></tr>
                            <tr><td>Default choice</td><td>—</td><td>Long sequences</td><td style={{ color: '#3fb950' }}>Most tasks</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="callout"><strong>Gradient clipping for all RNNs:</strong> <code>torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)</code> — call before optimizer.step().</div>
            </section >

            {/* ═══════════ PART 4: TRANSFORMERS ═══════════ */}
            < h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }
            }> Transformers</h2 >

            {/* ATTENTION */}
            < section className="card" id="attention" >
                <h2 className="card-title">Scaled Dot-Product Attention</h2>
                <p className="card-subtitle">"A context-routing mechanism that allows every token to look directly at every other token simultaneously." | <strong>Predecessor:</strong> LSTMs / Seq2Seq. | <strong>Solves:</strong> The sequential bottleneck of RNNs that prevents hardware parallelism, and the degradation of long-range context. | <strong>How:</strong> Computing scaled dot-products between Query, Key, and Value matrices to determine contextual relevance regardless of distance. | <strong>When:</strong> The core engine of all modern Large Language Models and Vision Transformers.</p>

                <img src="https://jalammar.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-chain.png" alt="LSTM cell architecture showing forget gate, input gate, and output gate with cell state highway" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--color-border)', background: 'white', padding: '0.5rem' }} />

                <div className="math-block">
                    {String.raw`$$Q = XW^Q, \quad K = XW^K, \quad V = XW^V$$`}
                    {String.raw`$$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right) \cdot V$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$Q$'} = query ("what am I looking for") · {'$K$'} = key ("what do I hold") · {'$V$'} = value ("what I give if selected") · {'$d_k$'} = key dimension · Divide by {String.raw`$\sqrt{d_k}$`} prevents softmax saturation. Complexity: {String.raw`$O(T^2 \cdot d)$`}.</p>

                <h3>Multi-Head Attention</h3>
                <div className="math-block">
                    {String.raw`$$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_H) \cdot W^O$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$H$'} heads run in parallel, each with own {'$W^Q_i, W^K_i, W^V_i$'}. Each head learns a different relationship type. {String.raw`$d_k = d_{\text{model}}/H$`} per head.</p>
            </section >

            {/* TRANSFORMER ARCH */}
            < section className="card" id="transformer-arch" >
                <h2 className="card-title">Transformer Architecture</h2>
                <p className="card-subtitle">"A highly parallelizable sequence-to-sequence architecture built entirely on self-attention." | <strong>Predecessor:</strong> LSTM Seq2Seq with attention. | <strong>Solves:</strong> The absolute inability to massively scale recurrent networks across thousands of GPUs. | <strong>How:</strong> Stacking blocks of Multi-Head Self-Attention, Feed-Forward Networks, and residual LayerNorms to build deep contextual representations. | <strong>When:</strong> SOTA NLP, translation, LLMs, and foundational multi-modal models.</p>

                <img src="https://jalammar.github.io/images/t/The_transformer_encoder_decoder_stack.png" alt="Transformer encoder-decoder stack showing N encoder blocks feeding into N decoder blocks" style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--color-border)', background: 'white', padding: '0.5rem' }} />


                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>LSTM / Seq2Seq with Attention</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>LSTMs are strictly sequential—they process one token at a time, completely bottlenecking hardware parallelism (GPUs). They also struggle with extremely remote long-range dependencies over 100+ tokens.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>"Attention Is All You Need." Discards recurrence entirely. Processes all tokens simultaneously in parallel using Self-Attention, connecting any token to any other token in $O(1)$ routing steps.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>State-of-the-art NLP, translation, LLMs, Vision Transformers (ViT).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Scaled Dot-Product Attention: {String.raw`$Attention(Q, K, V) = softmax\left(\frac{QK^T}{\sqrt{d_k}}\right)V$`}</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Categorical Cross-Entropy (per token):</strong> The model outputs a probability distribution over the entire vocabulary for every sequence position simultaneously. The derivative {String.raw`$p_i - y_i$`} is computed independently per token, removing the sequential backpropagation bottleneck altogether.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>AdamW with Warmup:</strong> High-dimensional attention layers require immense regularization to prevent overfitting. AdamW securely decouples weight decay (L2) from the adaptive learning rate formula. Warmup is mathematically required for Transformers because the variance of AdamW's momentum estimators is dangerously high early in training.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Contextualized embeddings per token $\implies$ Logits</span>
                    </div>
                </div>
                <h3>One Encoder Block (pseudo-code)</h3>
                <pre><code className="language-python">{`x = LayerNorm(x + MultiHeadSelfAttention(x))  # Add & Norm after attention
x = LayerNorm(x + FFN(x))                     # Add & Norm after feed-forward
# FFN = Linear(d, 4d) → ReLU → Linear(4d, d)  applied per token independently`}</code></pre>

                <h3>Original Hyperparameters (Vaswani 2017)</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Param</th><th>Value</th><th>Meaning</th></tr></thead>
                        <tbody>
                            <tr><td>d_model</td><td>512</td><td>Embedding dimension</td></tr>
                            <tr><td>d_ff</td><td>2048</td><td>FFN inner dim (4× d_model)</td></tr>
                            <tr><td>H (heads)</td><td>8</td><td>d_k = 512/8 = 64 per head</td></tr>
                            <tr><td>N (layers)</td><td>6+6</td><td>Encoder + Decoder blocks</td></tr>
                        </tbody>
                    </table>
                </div>
            </section >

            {/* ADD & NORM */}
            < section className="card" id="add-norm" >
                <h2 className="card-title">Add &amp; Norm</h2>
                <p className="card-subtitle">"A critical stabilization mechanism for ultra-deep networks." | <strong>Predecessor:</strong> Unnormalized deep networks / BatchNorm (for CNNs). | <strong>Solves:</strong> Exploding/vanishing gradients and internal covariate shift across hundreds of successive transformer blocks. | <strong>How:</strong> Wrapping every sublayer in a residual Add connection ({String.raw`$x + layer(x)$`}) followed immediately by Layer Normalisation computed strictly across the feature dimension. | <strong>When:</strong> Standard practice inside every single Transformer block.</p>
                <div className="math-block">
                    {String.raw`$$\text{output} = \text{LayerNorm}(x + \text{sublayer}(x))$$`}
                </div>
                <h3>LayerNorm Formula</h3>
                <div className="math-block">
                    {String.raw`$$\hat{x}_i = \frac{x_i - \mu}{\sqrt{\sigma^2 + \varepsilon}}, \quad y_i = \gamma \hat{x}_i + \beta$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$\mu, \sigma^2$`} = mean and variance of the feature vector · {String.raw`$\gamma, \beta$`} = learned scale and shift · Per-token normalization (independent of batch size).</p>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th></th><th>BatchNorm</th><th>LayerNorm</th></tr></thead>
                        <tbody>
                            <tr><td>Normalizes across</td><td>Batch dimension</td><td>Feature dimension</td></tr>
                            <tr><td>Works with batch=1</td><td style={{ color: '#f85149' }}>No</td><td style={{ color: '#3fb950' }}>Yes</td></tr>
                            <tr><td>Used in</td><td>CNNs</td><td>Transformers</td></tr>
                        </tbody>
                    </table>
                </div>
            </section >

            {/* POSITIONAL ENCODING */}
            < section className="card" id="pos-enc" >
                <h2 className="card-title">Positional Encoding</h2>
                <p className="card-subtitle">"A structural injection of absolute sequence order into parallelized token embeddings." | <strong>Predecessor:</strong> RNNs (natively strictly sequential). | <strong>Solves:</strong> The mathematically problematic fact that Multi-Head Attention processes all tokens simultaneously and therefore has absolutely no inherent concept of order. | <strong>How:</strong> Adding deterministic sine/cosine waves (or learned weights) directly into the raw token embedding vector before it enters the first network block. | <strong>When:</strong> Any architecture that processes sequences purely in parallel (Transformers).</p>
                <div className="math-block">
                    {String.raw`$$PE(\text{pos}, 2i) = \sin\!\left(\frac{\text{pos}}{10000^{2i/d}}\right), \quad PE(\text{pos}, 2i{+}1) = \cos\!\left(\frac{\text{pos}}{10000^{2i/d}}\right)$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{String.raw`$\text{pos}$`} = position index · {'$i$'} = dimension index · {'$d$'} = model dimension. Different dimensions oscillate at different frequencies. Final input = token_embedding + PE.</p>
                <p>Modern models (BERT, GPT) use <strong>learned</strong> PE: <code>nn.Embedding(max_seq_len, d_model)</code> trained like any weight.</p>
            </section >

            {/* MASKED ATTENTION */}
            < section className="card" id="masked-attn" >
                <h2 className="card-title">Masked Self-Attention</h2>
                <p className="card-subtitle">"A rigid causality-enforcing modification to standard Self-Attention." | <strong>Predecessor:</strong> Standard bidirectional attention. | <strong>Solves:</strong> The 'look-ahead' cheating problem during autoregressive text generation where a model could peer into future tokens to predict the next token. | <strong>How:</strong> Applying a strictly upper-triangular mask of negative infinities exclusively to the attention scores, pushing aggregate future softmax probabilities exactly to zero. | <strong>When:</strong> Exclusively inside causal Transformer Decoders (e.g., GPT).</p>
                <div className="math-block">
                    {String.raw`$$\text{scores} = \frac{QK^T}{\sqrt{d_k}} + M$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$M$'} = upper-triangular matrix of {String.raw`$-\infty$`}. After softmax: {String.raw`$\text{softmax}(-\infty) = 0$`} → future positions zeroed out.</p>
                <pre><code className="language-python">{`# Causal mask: True = block this position (fill with -inf before softmax)
mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
# Pass to attention: scores.masked_fill(mask, float('-inf'))`}</code></pre>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th></th><th>Encoder Self-Attention</th><th>Decoder Self-Attention</th></tr></thead>
                        <tbody>
                            <tr><td>Mask</td><td>None</td><td>Causal (upper-triangular -∞)</td></tr>
                            <tr><td>Direction</td><td>Bidirectional</td><td>Left-to-right only</td></tr>
                            <tr><td>Models</td><td>BERT</td><td>GPT</td></tr>
                        </tbody>
                    </table>
                </div>
            </section >

            {/* BERT */}
            <section className="card" id="bert">
                <h2 className="card-title">BERT — Bidirectional Encoder Representations</h2>
                <p className="card-subtitle">BERT is a massive, encoder-only model pre-trained on huge amounts of ordinary text using a "fill-in-the-blank" learning style. It completely replaces the old approach of building tiny, task-specific RNN models from scratch for every new project. It solves the problem of models only reading left-to-right, instead forcing the network to deeply understand the full surrounding context of a sentence in both directions at once. BERT architectures are the standard starting point for almost all high-accuracy text classification, semantic search embeddings, and Named Entity Recognition tasks.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Base Encoder-Decoder Transformers & LSTMs</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Sequential models like LSTMs struggled to remember long sentences, while early decoder models (like the first GPT) could only read text in one direction (left-to-right), making them blind to the future context of a sentence.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>It removes the generative Decoder part entirely and uses only an unmasked Encoder, allowing it to look at all words in a sentence simultaneously. It learns language by explicitly trying to guess 15% of the words that have been purposely hidden (Masked Language Modeling).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Text classification (spam, sentiment), semantic search embeddings, NER, question-answering systems.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Masked Language Modeling (MLM): maximize {String.raw`$P(x_{mask} | x_{unmasked})$`} across all indices using Softmax.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Cross-Entropy:</strong> It calculates loss only on the specific words it hid. This forces the model's internal representations to stretch and warp until it learns exactly how context clues predict missing words.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>AdamW:</strong> The standard for all giant neural networks, ensuring the massive number of weights shrink (decay) correctly without ruining the optimizer's learning speed.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>A dense summary vector (usually 768 dimensions) for every single token, typically pooled through the `[CLS]` token for full-sentence classification.</span>
                    </div>
                </div>
                <div className="callout"><strong>Key interview Q:</strong> Why can't BERT generate text? It doesn't have a built-in step-by-step Decoder mechanism and has no causal masking. It processes whole paragraphs at once and was never trained to output words sequentially.</div>
            </section>

            {/* GPT */}
            <section className="card" id="gpt">
                <h2 className="card-title">GPT — Generative Pre-trained Transformer</h2>
                <p className="card-subtitle">GPT is an autoregressive, decoder-only foundation model built specifically to generate continuous text. It replaces older recurrent text generators that would quickly forget what they were talking about after a few sentences. It solves the challenge of open-ended generation by using strict "causal masking," forcing the network to predict exactly one new word at a time based only on the words that came before it. GPT architectures are the absolute standard whenever you need a system for chatting, writing code, or generating long, open-ended content.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Base Encoder-Decoder Transformers</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Full Encoder-Decoder setups were too bulky and largely unnecessary if your only goal was to generate new text, which inherently only relies on the past context anyway.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>Strips out the Encoder half entirely. It operates purely on Causal (Masked) Self-Attention, learning language by endlessly playing "predict the next word" on internet-scale text.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Chatbots, code generation, summarization, zero-shot/few-shot reasoning.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>Next-token prediction: maximize {String.raw`$P(x_t | x_{<t})$`} by blocking out future tokens with an upper-triangular mask of negative infinities.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Categorical Cross-Entropy:</strong> It is penalized every single time it fails to assign the highest probability score to the actual real-world next word in the sequence.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>AdamW:</strong> Identical to BERT; used to safely manage weight decay across billions of parameters while keeping gradient momentum steady.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>Exactly one single token, sampled (via Softmax and Temperature) directly from the overall vocabulary.</span>
                    </div>
                </div>
            </section>

            {/* T5 */}
            <section className="card" id="t5">
                <h2 className="card-title">T5 — Text-to-Text Transfer Transformer</h2>
                <p className="card-subtitle">T5 is a complete Encoder-Decoder model engineered to treat absolutely every NLP task as a simple "text-in, text-out" problem. It replaces the messy practice of trying to force classification tasks into generative models, or translation tasks into encoders. It solves industry fragmentation by forcing everything—whether it's translation, summarizing, or even regression testing—to simply input a string of text and output a new string of text. T5 architectures shine when your explicitly stated goal is to read one large, structured document and output a completely transformed document.</p>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Architecture Context</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, max-content) 1fr', gap: '0.5rem 1rem' }}>
                        <strong style={{ color: 'var(--color-text-muted)' }}>Predecessor:</strong>
                        <span>Fragmented specialized models (BERT for classification, GPT for generation).</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Flaws of Predecessor:</strong>
                        <span>Companies had to maintain completely different model architectures depending on the specific goal they wanted to achieve, which slowed down deployment.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>What it Solves:</strong>
                        <span>It keeps the original full Encoder + Decoder setup intact. It formats every task identically (e.g., inputting "translate English to German: That is good" outputs "Das ist gut"). It learns by fixing "corrupted spans" where multiple consecutive words are hidden at once.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Where to Use:</strong>
                        <span>Translation, document summarization, question answering, rewriting workflows, executing Seq2Seq tasks.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Math Under Hood:</strong>
                        <span>The Encoder uses standard bidirectional attention to freely map the input text. The Decoder uses masked attention to generate the new text, while also "cross-attending" heavily back to the Encoder's map to make sure it stays on topic.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Loss Rationale:</strong>
                        <span><strong>Cross-Entropy:</strong> Calculated directly off the Decoder's generated output, feeding back into the network to simultaneously train both the Decoder's writing skills and the Encoder's reading comprehension.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Optimizer Rationale:</strong>
                        <span><strong>AdaFactor:</strong> Often swapped in for Adam inside T5 to drastically cut down on memory usage without losing much training speed or stability.</span>

                        <strong style={{ color: 'var(--color-text-muted)' }}>Output Format:</strong>
                        <span>A fully generated string of sequential text.</span>
                    </div>
                </div>

                <h3>Architectural Comparison Summary</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Feature</th><th>BERT</th><th>GPT</th><th>T5</th></tr></thead>
                        <tbody>
                            <tr><td>Architecture</td><td>Encoder only</td><td>Decoder only</td><td>Encoder + Decoder</td></tr>
                            <tr><td>Attention</td><td>Bidirectional</td><td>Causal (masked)</td><td>Enc: bidir, Dec: causal</td></tr>
                            <tr><td>Pre-training</td><td>MLM — predict masked tokens</td><td>CLM — predict next token</td><td>Span corruption</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* PRETRAIN FINETUNE */}
            <section className="card" id="pretrain">
                <h2 className="card-title">Pre-training vs Fine-tuning</h2>
                <p className="card-subtitle">Pre-training vs Fine-tuning is the standard deployment strategy for functionally adapting enormous models to tight, highly specific business use cases. Moving past direct inference (zero-shot) or the impossibility of training from scratch, it fundamentally solves the issue of foundation models being overly generalized by taking a deeply pre-trained backbone and rigorously training it strictly on a small, high-quality labeled dataset using tight parameter-efficient frameworks to prevent catastrophic forgetting.</p>
                <h3>Three Fine-tuning Modes</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Mode</th><th>What's trained</th><th>Speed</th><th>Use when</th></tr></thead>
                        <tbody>
                            <tr><td>Feature extraction</td><td>New head only, backbone frozen</td><td>Fastest</td><td>Small data, similar domain</td></tr>
                            <tr><td>LoRA / PEFT</td><td>Tiny A,B matrices (~0.1% params)</td><td>Fast</td><td>Large LLM, limited GPU</td></tr>
                            <tr><td>Full fine-tuning</td><td>All weights</td><td>Slow</td><td>Enough data + GPU</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3>LoRA Formula</h3>
                <div className="math-block">
                    {String.raw`$$W' = W + A \cdot B \quad A \in \mathbb{R}^{d \times r},\; B \in \mathbb{R}^{r \times d}$$`}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>{'$W$'} = frozen original weights · {'$A, B$'} = low-rank trainable matrices · {'$r$'} = rank (typically 8). For d=4096: 65K params vs 16.7M — 256× fewer.</p>
                <div className="callout"><strong>Catastrophic forgetting:</strong> Full fine-tuning on small data overwrites pre-trained knowledge. Prevent with low lr (1e-5), early stopping, or LoRA.</div>
            </section>

            {/* ═══════════ PART 4.5: LOSS, OPTIMIZATION & METRICS ═══════════ */}
            <h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Loss Functions &amp; Evaluation Metrics</h2>

            <section className="card" id="loss-functions">
                <h2 className="card-title">Loss Functions &amp; Chain Rule Simplifications</h2>
                <p className="card-subtitle">Loss functions act not just as metrics, but as fundamental gradient generators. By intelligently pairing a definitive loss function with a specific final layer activation, the exceedingly messy calculus of the neural chain rule perfectly reduces into a remarkably clean linear mathematical difference. This directly provides parameter weights with a proportional, flawlessly structured scalar measuring exactly how far off the resulting final probability was from the absolute truth boundaries.</p>

                <h3>1. Categorical Cross-Entropy (Multi-class)</h3>
                <p><strong>What it does with the output:</strong> It takes the raw logits, applies Softmax to create a probability distribution, and calculates the negative log-likelihood of the true class. It forces the correct class probability to 1 and all others to 0.</p>
                <div className="math-block">{String.raw`$$\text{CCE} = -\sum y_i \log(\hat{y}_i) \quad \text{where} \quad \hat{y}_i = \frac{e^{z_i}}{\sum e^{z_k}}$$`}</div>
                <p><strong>Chain Rule Simplification:</strong> Taking the derivative of the CE Loss with respect to the Softmax inputs {String.raw`$z_i$`} usually involves incredibly messy quotient rules. However, the properties of exponents perfectly cancel out the fractions, yielding a phenomenally simple gradient:</p>
                <div className="math-block">{String.raw`$$\frac{\partial \text{CCE}}{\partial z_i} = \hat{y}_i - y_i$$`}</div>
                <p><strong>Why this matters:</strong> The gradient is exactly the error! If predicted {String.raw`$\hat{y}_i = 0.9$`} and true {String.raw`$y_i = 1$`}, error is -0.1. The preceding dense layer simply receives exactly how far off it was, linearly.</p>

                <h3>2. Binary Cross-Entropy (Binary)</h3>
                <p><strong>What it does with the output:</strong> Evaluates a single sigmoid output bounding between 0 and 1, creating a steep logarithmic penalty the further the prediction is from the true binary 0 or 1 label.</p>
                <div className="math-block">{String.raw`$$\text{BCE} = -[y\log\hat{y} + (1-y)\log(1-\hat{y})] \quad \text{where} \quad \hat{y} = \sigma(z)$$`}</div>
                <p><strong>Chain Rule Simplification:</strong> Just like multi-class, combining BCE with the Sigmoid derivative ({String.raw`$\hat{y}(1-\hat{y})$`}) algebraically reduces to:</p>
                <div className="math-block">{String.raw`$$\frac{\partial \text{BCE}}{\partial z} = \hat{y} - y$$`}</div>

                <h3>3. Mean Squared Error (Regression)</h3>
                <p><strong>What it does with the output:</strong> Measures the average squared difference between continuous predictions and actuals. Squaring the error heavily penalizes large outliers.</p>
                <div className="math-block">{String.raw`$$\text{MSE} = \frac{1}{n} \sum (y_i - \hat{y}_i)^2$$`}</div>
                <p><strong>Chain Rule Simplification:</strong> Differentiating a square merely brings down the exponent.</p>
                <div className="math-block">{String.raw`$$\frac{\partial \text{MSE}}{\partial \hat{y}_i} = \frac{2}{n}(\hat{y}_i - y_i)$$`}</div>
                <p><strong>Why this matters:</strong> The gradient scales linearly with the error. Small errors produce small weight updates, allowing the network to settle smoothly into the regression minimum.</p>
            </section>

            <section className="card" id="optimizers">
                <h2 className="card-title">Optimizers &amp; Gradient Descent</h2>
                <p className="card-subtitle">Optimizers strictly dictate how mathematical gradients are physically translated into structural parameter weight updates. Replacing the impossibility of blindly navigating non-convex high-dimensional loss landscapes, they dictate exactly how aggressively or adaptively to iteratively step mathematically contrary to the local gradient slope, establishing the final required procedure utilized universally across all iteration-based neural networks.</p>

                <h3>1. Stochastic Gradient Descent (SGD)</h3>
                <p><strong>What it does with the gradients:</strong> It takes the raw gradient of the loss with respect to a weight, simply scales it by the learning rate, and subtracts it.</p>
                <div className="math-block">
                    {String.raw`$$W_{\text{new}} = W_{\text{old}} - \eta \frac{\partial L}{\partial W}$$`}
                </div>
                <p><strong>Why use it:</strong> Rarely used entirely on its own today, but SGD with Momentum is strongly favoured by researchers for fine-tuning ResNets or CNNs where extreme generalization is needed. Its noisy trajectory escapes bad local minima better than Adam.</p>

                <h3>2. Adam (Adaptive Moment Estimation)</h3>
                <p><strong>What it does with the gradients:</strong> Instead of a single uniform learning rate, Adam computes individual adaptive learning rates for every single parameter. It keeps a running moving average of both the past gradients (1st moment, momentum) and the squared gradients (2nd moment, variance scaling).</p>
                <div className="math-block">
                    {String.raw`$$W_{\text{new}} = W_{\text{old}} - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}$$`}
                </div>
                <p><strong>Why use it:</strong> This is the universal default for almost all Deep Learning models today (Transformers, RNNs, MLPs). It aggressively forces convergence even on sparse gradients and highly erratic loss landscapes.</p>
            </section>

            <section className="card" id="evaluation-metrics">
                <h2 className="card-title">Evaluation Metrics</h2>
                <p className="card-subtitle">"Human-readable statistical proxy metrics for explicitly communicating actual, real-world model quality." | <strong>Solves:</strong> Cross-Entropy or MSE loss values are highly abstract, strictly comparative, and mathematically impossible to directly translate into business ROI, clinical safety, or product requirements. | <strong>How:</strong> Computing heavily discrete success matrices like Precision, Recall, F1-Score, or MAE evaluated strictly on a hold-out test set. | <strong>When:</strong> Absolutely mandatory when formally reporting validated model performance to stakeholders or making hard deployment decisions.</p>

                <h3>Classification Metrics</h3>
                <ul>
                    <li><strong>Accuracy:</strong> Percentage of correct predictions. (Useless for imbalanced datasets).</li>
                    <li><strong>Precision:</strong> {String.raw`$TP / (TP + FP)$`} — "Of all positive predictions, how many were actually positive?" (Crucial when false positives are expensive, e.g., spam filters).</li>
                    <li><strong>Recall / Sensitivity:</strong> {String.raw`$TP / (TP + FN)$`} — "Of all actual positives, how many did we catch?" (Crucial when false negatives are dangerous, e.g., cancer detection).</li>
                    <li><strong>F1-Score:</strong> Harmonic mean of Precision and Recall. Balances the two for uneven datasets.</li>
                    <li><strong>ROC-AUC:</strong> Area under the Receiver Operating Characteristic curve. Evaluates the model's ability to rank positive instances higher than negative instances, regardless of the classification threshold.</li>
                </ul>

                <h3>Regression Metrics</h3>
                <ul>
                    <li><strong>MAE (Mean Absolute Error):</strong> Average absolute distance between prediction and actual. Highly interpretable business metric (e.g., "We are off by $500 on average").</li>
                    <li><strong>RMSE (Root Mean Squared Error):</strong> Standard deviation of prediction errors. Penalizes larger errors much more heavily than MAE.</li>
                    <li><strong>R² (Coefficient of Determination):</strong> Proportion of the variance in the target variable that is predictable from the features. Ranges from 0 to 1.</li>
                </ul>
            </section>
            <h2 className="part-header" style={{ color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>Reference</h2>

            {/* FORMULA SHEET */}
            <section className="card" id="dl-formula-sheet">
                <h2 className="card-title">Formula Reference Sheet</h2>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Forward Pass</h3>
                    {String.raw`$$z = Wx + b, \quad a = \sigma(z), \quad \text{params} = d_{\text{out}} \times d_{\text{in}} + d_{\text{out}}$$`}
                </div>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Gradient Descent + Adam</h3>
                    {String.raw`$$W \leftarrow W - \eta \frac{\partial L}{\partial W}, \quad \text{Adam: } W \leftarrow W - \eta\frac{\hat{m}_t}{\sqrt{\hat{v}_t}+\varepsilon}$$`}
                </div>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Conv2d</h3>
                    {String.raw`$$\text{out} = \lfloor(\text{in}+2p-k)/s\rfloor+1, \quad \text{params} = d_{\text{out}}(k^2 d_{\text{in}})+d_{\text{out}}$$`}
                </div>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>LSTM Cell</h3>
                    {String.raw`$$c_t = f_t \odot c_{t-1} + i_t \odot \tilde{g}_t, \quad h_t = o_t \odot \tanh(c_t), \quad \text{params} = 4((d_{\text{in}}+d_h)d_h+d_h)$$`}
                </div>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Attention</h3>
                    {String.raw`$$\text{Attention}(Q,K,V) = \text{softmax}(QK^T/\sqrt{d_k})V, \quad \text{complexity: } O(T^2 d)$$`}
                </div>
                <div className="math-block" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>LoRA</h3>
                    {String.raw`$$W' = W + AB, \quad A \in \mathbb{R}^{d \times r}, B \in \mathbb{R}^{r \times d}, \quad r \ll d$$`}
                </div>
            </section>

            {/* CODE APPENDIX */}
            <section className="card" id="dl-code-appendix">
                <h2 className="card-title">Code Reference</h2>

                <h3>Interview MLP — minimal, explainable</h3>
                <pre><code className="language-python">{`class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(8, 16)   # input→hidden: W is (16,8), 144 params
        self.fc2 = nn.Linear(16, 8)   # hidden→hidden: W is (8,16), 136 params
        self.fc3 = nn.Linear(8, 2)    # hidden→output: W is (2,8), 18 params
        self.relu = nn.ReLU()         # activation function (max(0,x))
        self.dropout = nn.Dropout(p=0.3)  # drop 30% of neurons randomly

    def forward(self, x):
        x = self.relu(self.fc1(x))    # linear + activation
        x = self.dropout(x)           # regularise between layers
        x = self.relu(self.fc2(x))    # second hidden layer
        x = self.dropout(x)           # regularise again
        return self.fc3(x)            # raw logits — no softmax (CrossEntropyLoss does it)

# 4-step training loop
optimizer.zero_grad()                 # clear gradients from previous iteration
logits = model(X)                     # forward pass: compute predictions
loss   = criterion(logits, y)         # compute loss (e.g. CrossEntropy)
loss.backward()                       # backprop: compute all gradients
optimizer.step()                      # update weights: W -= lr * grad`}</code></pre>

                <h3>Interview CNN — RGB input, 10 classes</h3>
                <pre><code className="language-python">{`class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)   # 3 input channels (RGB) → 32 filters
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)  # 32 → 64 filters, 18496 params
        self.pool  = nn.MaxPool2d(2, stride=2)   # halves spatial dims, no learnable params
        self.fc1   = nn.Linear(64 * 8 * 8, 128)  # flatten and project to 128
        self.fc2   = nn.Linear(128, 10)           # 128 → 10 classes

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))  # (B,3,32,32) → conv → relu → pool → (B,32,16,16)
        x = self.pool(F.relu(self.conv2(x)))  # (B,32,16,16) → conv → relu → pool → (B,64,8,8)
        x = x.view(x.size(0), -1)            # flatten: (B, 64*8*8) = (B, 4096)
        x = F.relu(self.fc1(x))               # fully connected + relu
        return self.fc2(x)                     # logits for 10 classes`}</code></pre>

                <h3>Scaled Dot-Product Attention — from scratch</h3>
                <pre><code className="language-python">{`def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k    = Q.size(-1)                                          # key dimension
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)  # QK^T / sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask, float('-inf'))          # block future positions
    weights = F.softmax(scores, dim=-1)                           # normalize to probabilities
    return torch.matmul(weights, V), weights                      # weighted sum of values`}</code></pre>

                <h3>Early Stopping — complete class</h3>
                <pre><code className="language-python">{`class EarlyStopping:
    def __init__(self, patience=10, min_delta=1e-4):
        self.patience, self.min_delta = patience, min_delta      # config
        self.counter, self.best_loss = 0, float('inf')           # tracking state
        self.best_weights = None                                  # saved model state

    def step(self, val_loss, model):
        if val_loss < self.best_loss - self.min_delta:           # improvement found
            self.best_loss = val_loss                             # update best
            self.best_weights = copy.deepcopy(model.state_dict())  # save best weights
            self.counter = 0                                      # reset patience
        else:
            self.counter += 1                                     # no improvement
        return self.counter >= self.patience                      # True = stop training

    def restore(self, model):
        model.load_state_dict(self.best_weights)                  # load best model`}</code></pre>
            </section>

        </>
    );
}
