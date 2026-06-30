---
trigger: always_on
---

# Quy tắc phát triển dự án PawNote (Project Development Rules)

## Nguyên lý Phân tách Trách nhiệm (Separation of Concerns - SoC)

Để đảm bảo mã nguồn dễ bảo trì, dễ kiểm thử và mở rộng, tất cả các tác vụ lập trình trong dự án phải tuân thủ nghiêm ngặt nguyên lý Phân tách Trách nhiệm. Cụ thể:

### 1. Phân chia tầng (Layered Architecture) trong API

Mã nguồn của ứng dụng API (`apps/api`) phải được tổ chức thành các tầng rõ rệt:

- **Routes / Controllers (Tầng Định tuyến & Điều hướng)**:
  - Chỉ làm nhiệm vụ nhận request, validate dữ liệu đầu vào (sử dụng Zod), định tuyến và trả về response (HTTP status, JSON).
  - Không chứa logic nghiệp vụ (business logic) phức tạp.
  - Không thực hiện truy vấn trực tiếp vào Database.
  - Gọi xuống tầng Service hoặc Repository để xử lý dữ liệu.
  - File định nghĩa nằm trong thư mục `src/routes/`.

- **Services (Tầng Nghiệp vụ - Business Logic)**:
  - Nơi xử lý các quy tắc nghiệp vụ, tính toán, và các luồng công việc phức tạp.
  - Đóng vai trò cầu nối giữa Router và Repository.

- **Repositories (Tầng Truy cập Dữ liệu - Data Access Layer)**:
  - Chỉ làm nhiệm vụ giao tiếp trực tiếp với Database thông qua Drizzle ORM.
  - Mỗi Repository tập trung quản lý một thực thể (Entity) duy nhất (ví dụ: `NodeRepository` quản lý bảng `nodes`, `EdgeRepository` quản lý bảng `edges`).
  - Không chứa logic điều hướng HTTP hay xử lý request/response.
  - File định nghĩa nằm trong thư mục `src/repositories/`.

### 2. Phân tách Trách nhiệm trong Frontend (Next.js / React)

Mã nguồn của ứng dụng Frontend (`apps/web`) phải được tổ chức tuân thủ các quy tắc sau:

- **UI Components (Tầng Hiển thị)**:
  - Chỉ tập trung vào hiển thị giao diện (HTML/CSS/JSX) và nhận các sự kiện đầu vào.
  - Hạn chế tối đa việc gọi API trực tiếp bên trong Component.
  - Sử dụng CSS thuần hoặc các component UI tái sử dụng từ `@pawnote/ui`.
  - Các file định nghĩa nằm trong thư mục `src/components/` hoặc `src/app/`.

- **Custom Hooks (Tầng Logic Nghiệp vụ & State)**:
  - Tất cả các xử lý logic phức tạp (tính toán đồ thị, tọa độ chuột, xử lý sự kiện kéo thả, quản lý local state của Canvas...) phải được đóng gói vào các **Custom Hooks** (ví dụ: `useGraph`, `useNodeDrag`).
  - Component UI chỉ import các hook này và sử dụng dữ liệu/hành động trả ra từ hook để hiển thị.
  - Các file định nghĩa nằm trong thư mục `src/hooks/`.

- **Context Providers (Tầng Quản lý Trạng thái Toàn cục)**:
  - Sử dụng React Context để chia sẻ dữ liệu và trạng thái giữa các component ở sâu trong cây (ví dụ: `GraphProvider` quản lý trạng thái chung của Canvas đồ thị).
  - Các file định nghĩa nằm trong thư mục `src/context/` hoặc `src/providers/`.

- **API Services / Fetching (Tầng Giao tiếp Dữ liệu)**:
  - Tách biệt hoàn toàn logic gọi API lên Backend ra các hàm helper/service (ví dụ: `src/services/api.ts`) hoặc sử dụng các hook quản lý data fetching (như TanStack Query).
  - Không viết trực tiếp các hàm `fetch` vô danh lặp đi lặp lại trong component.

### 3. Định nghĩa Kiểu dữ liệu & Schemas

- Tất cả các schemas xác thực dữ liệu phải được định nghĩa bằng **Zod** trong `@pawnote/types` (thư mục `packages/shared/types`).
- Sử dụng `z.infer<typeof Schema>` để suy luận kiểu dữ liệu tĩnh cho TypeScript, tránh định nghĩa trùng lặp (DRY).
- Sử dụng **pnpm catalog** để quản lý phiên bản của `zod`, `drizzle-orm` và các thư viện quan trọng khác tại `pnpm-workspace.yaml`, tránh lệch phiên bản giữa các workspace packages.

### 4. Quy định đối với AI Assistant (Antigravity)

- Khi thêm hoặc chỉnh sửa các API hoặc tính năng mới, AI Assistant **không được phép** viết trực tiếp toàn bộ code vào một file duy nhất (như `index.ts`).
- Bắt buộc phải tạo mới hoặc chia nhỏ mã nguồn vào đúng thư mục tương ứng (`routes/`, `repositories/`, `services/`) theo kiến trúc phân tầng đã đề ra.
- Luôn chạy lệnh kiểm tra kiểu (`npx tsc --noEmit` hoặc `pnpm check-types`) sau khi chỉnh sửa mã nguồn để đảm bảo không sinh lỗi biên dịch.
- Luôn viết mã nguồn sạch (Clean Code), có chú thích rõ ràng bằng tiếng Việt cho các đoạn xử lý phức tạp hoặc quan trọng.
