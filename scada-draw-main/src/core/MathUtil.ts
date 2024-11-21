export const DEG_TO_RAD_FACTOR = Math.PI / 180;
export const RAD_TO_DEG_FACTOR = 180 / Math.PI;

export function calculatePointOnCircle(centerX: number, centerY: number, r: number, theta: number) {
    theta = theta * DEG_TO_RAD_FACTOR;
    // 使用圆的参数方程计算交点坐标
    let x = centerX + r * Math.sin(theta);
    let y = centerY - r * Math.cos(theta);
  
    return { x: x, y: y };
  }
  