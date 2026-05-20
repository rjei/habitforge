package org.example.habitforgeclient.ui.components;

import javax.swing.*;
import java.awt.*;
import org.example.habitforgeclient.model.HabitModel;

public class HabitCard extends JPanel {
    public HabitCard(HabitModel habit, JComponent actionComponent) {
        setLayout(new BorderLayout(15, 0));
        setOpaque(false);
        setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        // Custom background & border akan digambar di paintComponent
        setMaximumSize(new Dimension(Integer.MAX_VALUE, 80));

        // Info Panel
        JPanel infoPanel = new JPanel(new GridLayout(2, 1, 2, 2));
        infoPanel.setOpaque(false);

        JLabel nameLabel = new JLabel(habit.name());
        nameLabel.setFont(new Font("Segoe UI", Font.BOLD, 15));
        nameLabel.setForeground(new Color(230, 235, 245));

        // Subtitle (Kategori & Resonance)
        JLabel subLabel = new JLabel(habit.type() + " QUEST  •  " + habit.category().toUpperCase());
        subLabel.setFont(new Font("Segoe UI", Font.BOLD, 10));
        subLabel.setForeground(new Color(100, 110, 130));

        infoPanel.add(nameLabel);
        infoPanel.add(subLabel);

        // XP Reward Badge di sebelah kanan
        JPanel rightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        rightPanel.setOpaque(false);

        JLabel xpLabel = new JLabel("+" + habit.xpReward() + " XP");
        xpLabel.setFont(new Font("Monospaced", Font.BOLD, 12));
        xpLabel.setForeground(new Color(46, 204, 113)); // Hijau Stat
        rightPanel.add(xpLabel);

        if (actionComponent != null) {
            rightPanel.add(actionComponent);
        }

        add(infoPanel, BorderLayout.CENTER);
        add(rightPanel, BorderLayout.EAST);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Card Container Gelap
        g2.setColor(new Color(19, 24, 34));
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);

        // Border Tipis Abu/Neon
        g2.setColor(new Color(31, 38, 51));
        g2.setStroke(new BasicStroke(1));
        g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 12, 12);

        super.paintComponent(g);
    }
}