from PIL import Image, ImageDraw, ImageFont


OUTPUT = "docs/cash_bill_sirichai_stationery.pdf"
FONT_PATH = "/System/Library/Fonts/Supplemental/Thonburi.ttc"


def font(size, bold=False):
    # Thonburi.ttc contains Thai glyphs and works well for image-based PDFs.
    index = 1 if bold else 0
    return ImageFont.truetype(FONT_PATH, size=size, index=index)


def text(draw, xy, value, size=36, fill=(25, 25, 25), bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def money(value):
    return f"{value:,.2f}"


def make_pdf():
    scale = 3
    width, height = 2480, 3508  # A4 at 300 DPI.
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)

    black = (20, 20, 20)
    gray = (90, 90, 90)
    line = (40, 40, 40)
    light = (235, 239, 242)
    accent = (26, 86, 112)

    margin = 180
    right = width - margin
    top = 150

    # Header
    text(draw, (margin, top), "ร้านศิริชัยสเตชันเนอรี", 78, accent, True)
    text(draw, (margin, top + 92), "123/45 ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพฯ 10600", 34, gray)
    text(draw, (margin, top + 142), "โทร. 02-456-7890   เลขประจำตัวผู้เสียภาษี 0105569001234", 34, gray)

    text(draw, (right, top + 18), "บิลเงินสด", 82, black, True, "ra")
    text(draw, (right, top + 108), "CASH BILL", 36, gray, False, "ra")

    draw.line((margin, top + 220, right, top + 220), fill=line, width=5)

    # Bill metadata and customer box
    box_top = top + 280
    box_h = 300
    draw.rounded_rectangle((margin, box_top, right, box_top + box_h), radius=18, outline=line, width=4)
    mid = margin + 1260
    draw.line((mid, box_top, mid, box_top + box_h), fill=line, width=3)

    text(draw, (margin + 42, box_top + 55), "ได้รับเงินจาก", 35, gray)
    text(draw, (margin + 42, box_top + 115), "บริษัท ตัวอย่าง จำกัด", 44, black, True)
    text(draw, (margin + 42, box_top + 188), "ที่อยู่ 88 อาคารตัวอย่าง ถนนสาทร แขวงสีลม เขตบางรัก กรุงเทพฯ 10500", 32, gray)

    text(draw, (mid + 42, box_top + 55), "เลขที่", 35, gray)
    text(draw, (right - 42, box_top + 55), "CB-2569-001", 38, black, True, "ra")
    text(draw, (mid + 42, box_top + 125), "วันที่", 35, gray)
    text(draw, (right - 42, box_top + 125), "19/05/2569", 38, black, True, "ra")
    text(draw, (mid + 42, box_top + 195), "เงื่อนไข", 35, gray)
    text(draw, (right - 42, box_top + 195), "ชำระเงินสด", 38, black, True, "ra")

    # Table
    table_top = box_top + box_h + 90
    row_h = 132
    table_w = right - margin
    col = [
        margin,
        margin + 160,
        margin + 1220,
        margin + 1510,
        margin + 1800,
        right,
    ]
    headers = ["ลำดับ", "รายการ", "จำนวน", "หน่วยละ", "จำนวนเงิน"]
    draw.rectangle((margin, table_top, right, table_top + row_h), fill=light, outline=line, width=4)
    for x in col[1:-1]:
        draw.line((x, table_top, x, table_top + row_h * 6), fill=line, width=3)
    for i, label in enumerate(headers):
        x0, x1 = col[i], col[i + 1]
        text(draw, ((x0 + x1) / 2, table_top + 72), label, 34, black, True, "mm")

    items = [
        ("1", "กระดาษถ่ายเอกสาร A4 80 แกรม", 5, 125.00),
        ("2", "ปากกาลูกลื่นสีน้ำเงิน", 20, 12.50),
        ("3", "แฟ้มเอกสารพลาสติก", 10, 37.50),
    ]
    y = table_top + row_h
    subtotal = 0
    for idx, desc, qty, price in items:
        amount = qty * price
        subtotal += amount
        draw.rectangle((margin, y, right, y + row_h), outline=line, width=3)
        text(draw, ((col[0] + col[1]) / 2, y + 67), idx, 34, black, False, "mm")
        text(draw, (col[1] + 34, y + 67), desc, 34, black, False, "lm")
        text(draw, ((col[2] + col[3]) / 2, y + 67), str(qty), 34, black, False, "mm")
        text(draw, (col[4] - 34, y + 67), money(price), 34, black, False, "rm")
        text(draw, (col[5] - 34, y + 67), money(amount), 34, black, False, "rm")
        y += row_h

    for _ in range(2):
        draw.rectangle((margin, y, right, y + row_h), outline=line, width=3)
        y += row_h

    # Summary
    summary_top = y + 70
    total = subtotal
    draw.rounded_rectangle((margin, summary_top, right, summary_top + 390), radius=18, outline=line, width=4)
    draw.line((margin + 1270, summary_top, margin + 1270, summary_top + 390), fill=line, width=3)

    text(draw, (margin + 44, summary_top + 70), "จำนวนเงินเป็นตัวอักษร", 34, gray)
    text(draw, (margin + 44, summary_top + 145), "หนึ่งพันสองร้อยห้าสิบบาทถ้วน", 46, black, True)
    text(draw, (margin + 44, summary_top + 250), "หมายเหตุ: เอกสารตัวอย่างสำหรับบันทึกการรับเงินสด", 32, gray)

    labels = [("รวมเงิน", subtotal), ("ภาษีมูลค่าเพิ่ม", 0.00), ("ยอดสุทธิ", total)]
    sy = summary_top + 65
    for label, value in labels:
        is_total = label == "ยอดสุทธิ"
        text(draw, (margin + 1320, sy), label, 36 if is_total else 34, black, is_total)
        text(draw, (right - 44, sy), money(value), 42 if is_total else 34, black, is_total, "ra")
        sy += 105

    # Signatures
    sig_top = summary_top + 520
    sig_w = 790
    gap = 150
    left_sig = margin + 140
    right_sig = left_sig + sig_w + gap
    for x, label in [(left_sig, "ผู้รับเงิน"), (right_sig, "ผู้จ่ายเงิน")]:
        draw.line((x, sig_top + 170, x + sig_w, sig_top + 170), fill=line, width=3)
        text(draw, (x + sig_w / 2, sig_top + 230), f"ลงชื่อ ........................................ {label}", 34, black, False, "mm")
        text(draw, (x + sig_w / 2, sig_top + 292), "(................................................)", 32, gray, False, "mm")

    # Footer
    text(draw, (width / 2, height - 150), "ขอบคุณที่ใช้บริการ", 38, accent, True, "mm")

    img.save(OUTPUT, "PDF", resolution=300.0)


if __name__ == "__main__":
    make_pdf()
    print(OUTPUT)
