async function exportToPDF() {
    const { jsPDF } = window.jspdf;

    const root = document.body;

    // Add class → hides UI cleanly
    root.classList.add("pdf-export-mode");

    // Wait for layout to update (important!)
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 295;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save("tradingview-analysis.pdf");

    // Remove class → layout returns perfectly
    root.classList.remove("pdf-export-mode");
}