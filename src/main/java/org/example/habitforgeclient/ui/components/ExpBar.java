package org.example.habitforgeclient.ui.components;

import javax.swing.*;
import java.awt.*;

public class ExpBar extends JPanel {
    private int currentXp = 14200;
    private int nextLevelXp = 15000;

    public ExpBar() {
        setOpaque(false);
        setPreferredSize(new Dimension(200, 20));
    }

    public void updateXp(int currentXp, int nextLevelXp) {
        this.currentXp = currentXp;
        this.nextLevelXp = Math.max(nextLevelXp, 1);
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = 6; // Tipis dan elegan seperti di design web

        // Track Background
        g2.setColor(new Color(31, 38, 51));
        g2.fillRoundRect(0, 0, w, h, h, h);

        // Fill Progress (Neon Cyan / Blue)
        double ratio = (double) currentXp / nextLevelXp;
        int fillWidth = (int) (ratio * w);
        if (fillWidth > 0) {
            g2.setColor(new Color(52, 152, 219));
            g2.fillRoundRect(0, 0, fillWidth, h, h, h);
        }
    }
}