export function getPrimaryPurpose(slug: string): string {
  const cleanSlug = slug.replace(/-server$/, '').replace(/-mcp$/, '');
  
  const purposeMap: Record<string, string> = {
    // Coding Agents
    "openhands": "Chạy dự án tự trị trong Docker sandbox an toàn",
    "devin": "Kỹ sư phần mềm AI tự trị giải quyết issue phức tạp",
    "factory-droid": "Tự động sửa lỗi dự án & gửi Pull Request",
    "openclaw": "Điều phối đa Agents lập trình mã nguồn mở",
    "hermes-agent": "Thực thi tác vụ lập trình tự động hóa dòng lệnh",
    "claude-code": "CLI siêu tốc hỗ trợ sửa lỗi & refactor code quy mô lớn",
    "codex-cli": "Viết script ngắn & chạy câu lệnh terminal nhanh",
    "gemini-antigravity-cli": "Lập trình context khổng lồ & audit toàn bộ codebase",
    "opencode": "Hỗ trợ lập trình dòng lệnh CLI mã nguồn mở hoàn toàn",
    "ampcode-neo": "Tối ưu hóa mã nguồn triển khai điện toán đám mây",
    "augmentcode": "Bổ trợ viết code IDE thông minh thời gian thực",

    // MCP Servers
    "github": "Tự động hóa Git, tạo Pull Request & quản lý issue",
    "brave-search": "Tìm kiếm tài liệu & API trực tuyến tránh mã lỗi thời",
    "context7": "Cung cấp ngữ cảnh tài liệu sạch chống AI ảo giác",
    "playwright": "Duyệt web ảo, chụp ảnh màn hình & vá lỗi giao diện UI",
    "postgres-dbhub": "Truy vấn CSDL SQL bằng câu lệnh ngôn ngữ tự nhiên",
    "aider": "Ủy thác sửa code nền quy mô lớn, tự lưu git history",
    "filesystem": "Đọc/ghi tệp tin hệ thống an toàn dưới dạng sandbox",
    "superpower": "Thực thi shell command trong môi trường container",
    "sequential-thinking": "Suy nghĩ lập luận logic chuỗi tuần tự trước khi code",
    "slack": "Gửi thông báo & tin nhắn Slack tự động hóa từ terminal",
    "sourcegraph": "Tìm kiếm & phân tích mã nguồn quy mô lớn",

    // LLM Models
    "claude-opus-sonnet": "Suy luận lập trình nâng cao và refactor cấu trúc lớn",
    "claude-opus-4.8": "Suy luận lập trình nâng cao và refactor cấu trúc lớn",
    "claude-sonnet-4.6": "Mô hình lập trình cân bằng giữa tốc độ & chất lượng",
    "gpt-5-codex": "Giải quyết các thuật toán phức tạp & cấu trúc dữ liệu khó",
    "deepseek-v4": "Mô hình mã nguồn mở chạy local bảo mật dữ liệu tối cao",
    "kimi-k2": "Xử lý ngữ cảnh tiếng Việt và đọc tài liệu dài xuất sắc",
    "gemini-3-pro": "Xử lý context window 1M+ tokens khổng lồ cho cả repo",

    // Skills
    "file-edit": "Đọc, sửa đổi & cập nhật mã nguồn tệp tin cục bộ",
    "command-execution": "Thực thi shell command terminal & chạy test suite",
    "repo-map-skill": "Vẽ sơ đồ liên kết ctags phân tích cấu trúc codebase",
    "ponytail": "Tối giản code, ép tuân thủ YAGNI chống bloatware",
    "web-search": "Tự động tra cứu tìm kiếm web cập nhật tài liệu API mới",
    "a11y-debugging": "Kiểm thử khả năng tiếp cận (Accessibility) chuẩn WCAG",
    "chrome-devtools": "Tự động hóa trình duyệt Chrome & debug UI trực quan",
    "troubleshooting": "Tự động chẩn đoán và sửa lỗi kết nối mạng, cài đặt"
  };

  return purposeMap[cleanSlug] || purposeMap[slug] || "Tài nguyên cấu hình bổ trợ tối ưu hóa năng lực Coding Agent";
}
